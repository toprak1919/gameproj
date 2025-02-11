import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Redis client setup
const redisClient = createClient({
  url: process.env.REDIS_URL
});

await redisClient.connect();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Initialize player
  socket.on('initPlayer', async () => {
    await redisClient.hSet(`player:${socket.id}`, {
      health: 100,
      score: 0,
      x: 0,
      y: 1,
      z: 0,
      rotation: JSON.stringify({ x: 0, y: 0, z: 0, w: 1 })
    });

    // Get all current players
    const players = await getAllPlayers();
    socket.emit('initGameState', players);

    // Notify others
    socket.broadcast.emit('playerJoined', {
      userId: socket.id,
      health: 100,
      score: 0,
      position: [0, 1, 0]
    });
  });

  socket.on('playerMove', async (data) => {
    // Store player position in Redis
    await redisClient.hSet(`player:${data.userId}`, {
      x: data.x,
      y: data.y,
      z: data.z,
      rotation: JSON.stringify(data.rotation)
    });

    // Broadcast to other players
    socket.broadcast.emit('playerMoved', data);
  });

  socket.on('playerDamaged', async (data) => {
    const { targetId, damage } = data;
    const playerData = await redisClient.hGetAll(`player:${targetId}`);
    
    if (playerData) {
      const newHealth = Math.max(0, parseInt(playerData.health) - damage);
      await redisClient.hSet(`player:${targetId}`, 'health', newHealth);

      // Broadcast health update
      io.emit('healthUpdate', {
        userId: targetId,
        health: newHealth
      });

      // If player died
      if (newHealth === 0) {
        // Update attacker's score
        const attackerScore = parseInt(await redisClient.hGet(`player:${socket.id}`, 'score')) + 1;
        await redisClient.hSet(`player:${socket.id}`, 'score', attackerScore);

        io.emit('playerKilled', {
          killedId: targetId,
          killerId: socket.id,
          killerScore: attackerScore
        });

        // Respawn the dead player
        setTimeout(async () => {
          await redisClient.hSet(`player:${targetId}`, {
            health: 100,
            x: 0,
            y: 1,
            z: 0
          });

          io.emit('playerRespawned', {
            userId: targetId,
            position: [0, 1, 0],
            health: 100
          });
        }, 3000);
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    await redisClient.del(`player:${socket.id}`);
    io.emit('playerLeft', { userId: socket.id });
  });
});

// Helper function to get all players
async function getAllPlayers() {
  const keys = await redisClient.keys('player:*');
  const players = {};

  for (const key of keys) {
    const id = key.split(':')[1];
    const data = await redisClient.hGetAll(key);
    players[id] = {
      health: parseInt(data.health),
      score: parseInt(data.score),
      position: [parseFloat(data.x), parseFloat(data.y), parseFloat(data.z)],
      rotation: JSON.parse(data.rotation)
    };
  }

  return players;
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 