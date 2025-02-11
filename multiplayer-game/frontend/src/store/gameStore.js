import { create } from 'zustand';

const useGameStore = create((set) => ({
  players: {},
  localPlayer: null,
  
  addPlayer: (playerId, playerData) => 
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: playerData
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
    
  setLocalPlayer: (playerData) =>
    set({ localPlayer: playerData }),
    
  removePlayer: (playerId) =>
    set((state) => {
      const { [playerId]: removed, ...remaining } = state.players;
      return { players: remaining };
    })
}));

export default useGameStore; 