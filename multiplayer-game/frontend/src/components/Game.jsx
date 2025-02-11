import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';
import Player from './Player';
import Ground from './Ground';
import useGameStore from '../store/gameStore';

function Game() {
  const { players, localPlayer } = useGameStore();

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Physics>
        <Ground />
        {localPlayer && (
          <Player 
            key={localPlayer.id}
            isLocal={true}
            {...localPlayer}
          />
        )}
        {Object.entries(players).map(([id, data]) => (
          <Player 
            key={id}
            isLocal={false}
            {...data}
          />
        ))}
      </Physics>
    </Canvas>
  );
}

export default Game; 