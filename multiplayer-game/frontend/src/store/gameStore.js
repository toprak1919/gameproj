import { create } from 'zustand';

const useGameStore = create((set) => ({
  players: {},
  localPlayer: null,
  
  addPlayer: (playerId, playerData) => 
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...playerData,
          health: 100, // Initialize with full health
          score: 0
        }
      }
    })),
    
  updatePlayerPosition: (playerId, position) =>
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          position
        }
      }
    })),

  updatePlayerHealth: (playerId, newHealth) =>
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          health: Math.max(0, Math.min(100, newHealth)) // Clamp between 0 and 100
        }
      }
    })),

  updatePlayerScore: (playerId, scoreChange) =>
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          score: (state.players[playerId]?.score || 0) + scoreChange
        }
      }
    })),
    
  setLocalPlayer: (playerData) =>
    set({ 
      localPlayer: {
        ...playerData,
        health: 100,
        score: 0
      }
    }),
    
  removePlayer: (playerId) =>
    set((state) => {
      const { [playerId]: removed, ...remaining } = state.players;
      return { players: remaining };
    })
}));

export default useGameStore; 