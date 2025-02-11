import { io } from 'socket.io-client';
import useGameStore from './store/gameStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const socket = io(BACKEND_URL);

// Handle socket events
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Set up local player
  useGameStore.getState().setLocalPlayer({
    id: socket.id,
    position: [0, 1, 0]
  });
});

socket.on('playerMoved', (data) => {
  useGameStore.getState().updatePlayerPosition(data.userId, {
    x: data.x,
    y: data.y,
    z: data.z,
    rotation: data.rotation
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

export default socket; 