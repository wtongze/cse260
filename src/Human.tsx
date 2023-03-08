import { useLoader } from '@react-three/fiber';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { Mesh, BufferAttribute, Euler } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { degToRad } from 'three/src/math/MathUtils';

const STEP = 100;

export function Human() {
  const [current, setCurrent] = useState(0);
  const obj1 = useLoader(OBJLoader, '/SPRING0001.obj');
  const obj2 = useLoader(OBJLoader, '/SPRING0002.obj');

  const human1 = obj1.children[0] as Mesh;
  const human2 = obj2.children[0] as Mesh;

  const position1 = human1.geometry.attributes.position as BufferAttribute;
  const position2 = human2.geometry.attributes.position as BufferAttribute;

  const base = useMemo(() => {
    return [...(position1.array as number[])];
  }, [position1]);

  const diffArray = useMemo(() => {
    const temp = [];
    for (let i = 0; i < position1.array.length; i += 1) {
      temp.push(position2.array[i] - position1.array[i]);
    }
    return temp;
  }, [position1, position2]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (current < STEP) {
        setCurrent(current + 1);
      } else {
        setCurrent(0);
      }
    }, 20);
    return () => {
      clearInterval(timer);
    };
  }, [current]);

  human1.setRotationFromEuler(new Euler(degToRad(-90), 0, 0));

  const pointArray = position1.array as number[];
  for (let i = 0; i < pointArray.length; i += 1) {
    pointArray[i] = base[i] + (diffArray[i] / STEP) * current;
  }
  position1.needsUpdate = true;

  return (
    <>
      <scene>
        <directionalLight position={[1, 0, 1]} intensity={0.8} />
        <directionalLight position={[-1, 0, 0]} intensity={0.8} />
        <directionalLight position={[1, 0, -1]} intensity={0.5} />
        <Suspense fallback={null}>
          <mesh {...human1}>
            <meshPhongMaterial color={'gray'} />
          </mesh>
        </Suspense>
      </scene>
    </>
  );
}
