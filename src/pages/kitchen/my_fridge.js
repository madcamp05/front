import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 병 컴포넌트 생성 함수
const createBottleComponent = (color, stickerColor, index) => {
  return () => {
    const bottleRef = useRef();
    const capRef = useRef();
    const [capOpen, setCapOpen] = useState(false);

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
    const stickerGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.7, 16);

    // 뚜껑 애니메이션
    useFrame(() => {
      if (capOpen) {
        capRef.current.position.y += 0.3; // 더 빨리 날아가도록 값 증가
        if (capRef.current.position.y > 10) {
          capRef.current.position.y = 2.9;
          setCapOpen(false); // 일정 높이 이상 올라가면 초기 위치로 리셋
        }
      }
    });

    // 병 점프 애니메이션
    useFrame(({ clock }) => {
      const elapsedTime = clock.getElapsedTime();
      const jumpHeight = Math.sin(elapsedTime * 2 + index) * 0.5; // 병들이 교차하며 점프하도록 설정
      bottleRef.current.position.y = jumpHeight;
      if (jumpHeight > 0.4 && !capOpen) {
        setCapOpen(true); // 병이 특정 높이에 도달할 때 뚜껑이 날아가도록 설정
      }
    });

    return (
      <group ref={bottleRef}>
        {/* 병 본체 */}
        <mesh geometry={bottleGeometry} position={[0, -0.5, 0]}>
          <meshStandardMaterial color={color} />
        </mesh>
        {/* 병 뚜껑 */}
        <mesh geometry={capGeometry} position={[0, 2.9, 0]} ref={capRef}>
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* 스티커 */}
        <mesh geometry={stickerGeometry} position={[0, 0.9, 0]}>
          <meshStandardMaterial color={stickerColor} />
        </mesh>
      </group>
    );
  };
};

// 각 병 컴포넌트 정의
const KetchupBottle = createBottleComponent("#E32636", "white", 0);
const MustardBottle = createBottleComponent("#FFD700", "white", 1);
const ColaBottle = createBottleComponent("#2E2E2E", "white", 2);
const CiderBottle = createBottleComponent("#ADD8E6", "white", 3);

const MyFridge = () => {
  return (
    <Canvas
      camera={{ position: [0, 5, 15], fov: 60 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'salmon' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <group position={[-4.5, -1, 0]}>
        <KetchupBottle />
      </group>
      <group position={[-1.5, -1, 0]}>
        <MustardBottle />
      </group>
      <group position={[1.5, -1, 0]}>
        <ColaBottle />
      </group>
      <group position={[4.5, -1, 0]}>
        <CiderBottle />
      </group>
      <OrbitControls />
    </Canvas>
  );
};

export default MyFridge;
