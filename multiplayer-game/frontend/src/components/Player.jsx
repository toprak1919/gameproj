import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, vec3 } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import socket from '../socket';

function Player({ id, isLocal, position = [0, 1, 0] }) {
  const rigidBody = useRef();
  const [, getKeys] = useKeyboardControls();

  useFrame(() => {
    if (!isLocal || !rigidBody.current) return;

    const keys = getKeys();
    const impulse = vec3({ x: 0, y: 0, z: 0 });
    const SPEED = 0.5;

    if (keys.forward) impulse.z -= SPEED;
    if (keys.backward) impulse.z += SPEED;
    if (keys.left) impulse.x -= SPEED;
    if (keys.right) impulse.x += SPEED;

    rigidBody.current.applyImpulse(impulse, true);

    // Send position update to server
    const pos = rigidBody.current.translation();
    const rot = rigidBody.current.rotation();
    
    socket.emit('playerMove', {
      userId: id,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      rotation: rot
    });
  });

  return (
    <RigidBody 
      ref={rigidBody}
      position={position}
      enabledRotations={[false, true, false]}
    >
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color={isLocal ? "#ff0000" : "#00ff00"} />
      </mesh>
    </RigidBody>
  );
}

export default Player; 