import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 케찹 병 컴포넌트
const KetchupBottle = () => {
  const bottleRef = useRef();
  const capRef = useRef();

  // 병 본체 생성
  const bottleShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.6, 0);
    shape.lineTo(0.75, 0.2);
    shape.lineTo(0.8, 1);
    shape.lineTo(0.75, 1.5);
    shape.lineTo(0.65, 2);
    shape.lineTo(0.4, 2.3);
    shape.lineTo(0.4, 2.6);
    shape.lineTo(0.5, 2.8);
    shape.lineTo(0.5, 3);
    shape.lineTo(0.4, 3.2);
    shape.lineTo(0.35, 3.3);
    shape.lineTo(0, 3.3);
    return shape;
  }, []);

  const bottleGeometry = useMemo(() => new THREE.LatheGeometry(bottleShape.extractPoints(10).shape, 32), [bottleShape]);

  // 뚜껑 생성
  const capGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);

  // 스티커 생성 (두께를 더 얇게 조정)
  const stickerGeometry = new THREE.CylinderGeometry(0.90, 0.90, 0.7, 16);

  return (
    <group ref={bottleRef}>
      {/* 병 본체 */}
      <mesh geometry={bottleGeometry} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#E32636" />
      </mesh>
      {/* 병 뚜껑 */}
      <mesh geometry={capGeometry} position={[0, 2.9, 0]} ref={capRef}>
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* 하얀색 스티커 */}
      <mesh geometry={stickerGeometry} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

const MyFridge = () => {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 60 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'skyblue' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <KetchupBottle />
      <OrbitControls />
    </Canvas>
  );
};

export default MyFridge;
