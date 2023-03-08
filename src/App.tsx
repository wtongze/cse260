import { Canvas, RootState } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { useState } from 'react';
import { download } from './Utils';
import { Human } from './Human';
import './App.css';

function App() {
  const [three, setThree] = useState<RootState>();

  return (
    <div
      className="App"
      style={{ height: '100vh', display: 'flex', flexFlow: 'column' }}
    >
      <div>
        <button
          onClick={() => {
            const modelMesh = three?.scene.children[0].children[3]!;
            const exporter = new GLTFExporter();
            const fileName = 'model.gltf';
            exporter.parse(
              modelMesh,
              (gltf) => {
                const modelFile = new Blob([JSON.stringify(gltf)]);
                download(modelFile, fileName);
              },
              console.error
            );
          }}
        >
          Download
        </button>
      </div>

      <div id="convas-container" style={{ flexGrow: 1 }}>
        <Canvas
          camera={{ position: [0, 0, 2] }}
          gl={{ preserveDrawingBuffer: true }}
          onCreated={setThree}
        >
          <Human />
          <OrbitControls />
          <Stats className="stats" />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
