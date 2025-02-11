import { io } from 'socket.io-client';
import useGameStore from './store/gameStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const socket = io(BACKEND_URL);

socket.on('connect', () => {
  console.log('Connected to server');
  
  // Initialize local player
  useGameStore.getState().setLocalPlayer({
    id: socket.id,
    position: [0, 1, 0],
    health: 100,
    score: 0
  });

  // Request initial game state
  socket.emit('initPlayer');
});

socket.on('initGameState', (players) => {
  Object.entries(players).forEach(([id, data]) => {
    if (id !== socket.id) {
      useGameStore.getState().addPlayer(id, {
        ...data,
        position: data.position
      });
    }
  });
});

socket.on('playerJoined', (data) => {
  useGameStore.getState().addPlayer(data.userId, {
    position: data.position,
    health: data.health,
    score: data.score
  });
});

socket.on('playerMoved', (data) => {
  useGameStore.getState().updatePlayerPosition(data.userId, [data.x, data.y, data.z]);
});

socket.on('healthUpdate', (data) => {
  useGameStore.getState().updatePlayerHealth(data.userId, data.health);
});

socket.on('playerKilled', (data) => {
  // Update killer's score
  useGameStore.getState().updatePlayerScore(data.killerId, 1);
  
  // Update killed player's position (off-screen)
  useGameStore.getState().updatePlayerPosition(data.killedId, [0, -10, 0]);
});

socket.on('playerRespawned', (data) => {
  useGameStore.getState().updatePlayerPosition(data.userId, data.position);
  useGameStore.getState().updatePlayerHealth(data.userId, data.health);
});

socket.on('playerLeft', (data) => {
  useGameStore.getState().removePlayer(data.userId);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

export default socket; 