# Multiplayer 3D Game

A real-time multiplayer 3D game built with React Three Fiber, Rapier physics, and Socket.IO.

## Features

- Real-time multiplayer gameplay
- Physics-based movement and jumping
- Health and score system
- Player respawning
- Real-time position synchronization
- Scoreboard UI

## Prerequisites

- Node.js (v16 or higher)
- Redis server
- npm or yarn

## Project Structure

```
multiplayer-game/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── config/
│   │   └── socket.js
│   └── package.json
├── backend/           # Express backend
│   ├── server.js
│   └── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd multiplayer-game
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:

Create `backend/.env`:
```
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
PORT=3000
```

Create `frontend/.env`:
```
VITE_BACKEND_URL=http://localhost:3000
```

5. Start Redis server (platform dependent):
```bash
# Windows (WSL)
redis-server

# macOS
brew services start redis

# Linux
sudo service redis-server start
```

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

8. Open your browser and navigate to:
```
http://localhost:5173
```

## Game Controls

- WASD / Arrow Keys: Move
- Spacebar: Jump

## Development

- Frontend runs on Vite dev server (port 5173)
- Backend runs on Express (port 3000)
- Redis must be running for the backend to work

## Technologies Used

- React + Vite
- React Three Fiber
- React Three Rapier
- Socket.IO
- Express
- Redis
- Zustand 