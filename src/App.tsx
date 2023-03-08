import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Euler } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import './App.css';
import { degToRad } from 'three/src/math/MathUtils';

function Human() {
  const obj = useLoader(OBJLoader, '/SPRING0001.obj');

  const human = obj.children[0];
  human.setRotationFromEuler(new Euler(degToRad(-90), 0, 0));
  console.log(human);

  return (
    <>
      <scene>
        <directionalLight position={[1, 0, 1]} intensity={0.8} />
        <directionalLight position={[-1, 0, 0]} intensity={0.8} />
        <directionalLight position={[1, 0, -1]} intensity={0.5} />
        <mesh {...human}>
          <meshPhongMaterial color={'gray'} />
        </mesh>
      </scene>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <div id="convas-container" style={{ height: '100vh' }}>
        <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 2] }}>
          <Human />
          <OrbitControls />
          <Stats />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
