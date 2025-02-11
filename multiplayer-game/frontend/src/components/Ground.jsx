import { RigidBody } from '@react-three/rapier';

function Ground() {
  return (
    <RigidBody type="fixed" position={[0, -0.5, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial color="#303030" />
      </mesh>
    </RigidBody>
  );
}

export default Ground; 