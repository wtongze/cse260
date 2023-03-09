import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { Mesh, BufferAttribute, Euler, MeshPhongMaterial } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { degToRad } from 'three/src/math/MathUtils';

const STEP = 100;

type Props = {
  rotation?: number[];
  position?: number[];
  delta: number;
  base: string;
  target: string;
};

export function Human(props: Props) {
  const { delta: current } = props;

  const obj1 = useLoader(OBJLoader, props.base);
  const obj2 = useLoader(OBJLoader, props.target);

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

  if (props.rotation) {
    human1.setRotationFromEuler(new Euler(...props.rotation.map(degToRad)));
  }

  if (props.position) {
    const [x, y, z] = props.position;
    human1.position.set(x, y, z);
  }

  const pointArray = position1.array as number[];
  for (let i = 0; i < pointArray.length; i += 1) {
    pointArray[i] = base[i] + (diffArray[i] / STEP) * current;
  }
  position1.needsUpdate = true;

  human1.material = new MeshPhongMaterial({color: 'gray'});

  return (
    <>
      <scene>
        <directionalLight position={[1, 0, 1]} intensity={0.8} />
        <directionalLight position={[-1, 0, 0]} intensity={0.8} />
        <directionalLight position={[1, 0, -1]} intensity={0.5} />
        <mesh {...human1} children={null} />
      </scene>
    </>
  );
}
