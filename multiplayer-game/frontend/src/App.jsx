import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { keyboardControls } from './config/controls';
import Game from './components/Game';
import Scoreboard from './components/Scoreboard';

function App() {
  return (
    <KeyboardControls map={keyboardControls}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Canvas shadows>
          <Physics>
            <Game />
          </Physics>
        </Canvas>
        <Scoreboard />
      </div>
    </KeyboardControls>
  );
}

export default App; 