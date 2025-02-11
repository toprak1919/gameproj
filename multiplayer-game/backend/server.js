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

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 