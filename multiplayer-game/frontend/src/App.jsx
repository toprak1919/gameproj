import { KeyboardControls } from '@react-three/drei';
import { keyboardControls } from './config/controls';
import Game from './components/Game';

function App() {
  return (
    <KeyboardControls map={keyboardControls}>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Game />
      </div>
    </KeyboardControls>
  );
}

export default App; 