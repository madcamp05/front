import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// 불꽃 컴포넌트
const Flame = ({ position }) => {
  const flameRef = useRef();
  const clock = new THREE.Clock();

  useFrame(() => {
    const elapsedTime = clock.getElapsedTime();
    if (flameRef.current) {
      flameRef.current.scale.set(1 + Math.sin(elapsedTime * 10) * 0.1, 1 + Math.sin(elapsedTime * 10) * 0.1, 1);
      flameRef.current.material.opacity = 0.7 + Math.sin(elapsedTime * 5) * 0.3;
    }
  });

  return (
    <mesh ref={flameRef} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="blue" transparent />
    </mesh>
  );
};

const BlueFlame = () => {
  const flames = [];
  const numFlames = 8;
  const radius = 1;

  for (let i = 0; i < numFlames; i++) {
    const angle = (i / numFlames) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    flames.push(<Flame key={i} position={[x, 0.3, z]} />);
  }

  return <group>{flames}</group>;
};

// Rising spheres component
const RisingSpheres = () => {
  const [spheres, setSpheres] = useState([]);
  const clock = new THREE.Clock();
  const radius = 1.3; // Smaller radius for sphere generation

  useEffect(() => {
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const r = radius * Math.sqrt(Math.random());
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      setSpheres(prev => [...prev, { key: Date.now() + Math.random(), position: [x, -0.75, z] }]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    const elapsedTime = clock.getElapsedTime();
    setSpheres(prev =>
      prev.map(sphere => {
        if (sphere.position[1] > 3) {
          return null; // Remove the sphere if it has risen above a certain height
        }
        return {
          ...sphere,
          position: [sphere.position[0], sphere.position[1] + 0.05, sphere.position[2]], // Move the sphere upwards
        };
      }).filter(Boolean)
    );
  });

  return (
    <group>
      {spheres.map(sphere => (
        <mesh key={sphere.key} position={sphere.position}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
    </group>
  );
};

// 고급스러운 냄비 컴포넌트
const HighQualityPot = ({ isOn }) => {
  return (
    <group position={[0, 1, 0]}>
      {/* 냄비 몸체 */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 1.5, 32, 1, true]} />
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* 냄비 바닥 */}
      <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* 냄비 테두리 */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 냄비 손잡이 */}
      <mesh position={[-1.6, 0, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[1.6, 0, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* Rising Spheres */}
      {isOn && <RisingSpheres />}
      {/* Cylinder to represent filled pot */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 1.0, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

// Button component
const ToggleButton = ({ isOn, toggle }) => {
  const buttonRef = useRef();

  useFrame(() => {
    if (buttonRef.current) {
      buttonRef.current.rotation.z = isOn ? Math.PI / 6 : -Math.PI / 6; // Tilt the button
    }
  });

  return (
    <group>
      <mesh position={[2.5, 0, 0]} ref={buttonRef} onClick={toggle}>
        <boxGeometry args={[1, 0.2, 0.5]} />
        <meshStandardMaterial color={isOn ? 'green' : 'red'} />
      </mesh>
      <Text
        position={[2.5, 0.3, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {isOn ? 'ON' : 'OFF'}
      </Text>
    </group>
  );
};

const GasStove = ({ isOn, toggle }) => {
  return (
    <mesh position={[0, -1, 0]}>
      <cylinderGeometry args={[2, 2, 0.5, 32]} />
      <meshStandardMaterial color="black" />
      {isOn && <BlueFlame />} {/* Conditionally render BlueFlame */}
      <ToggleButton isOn={isOn} toggle={toggle} />
    </mesh>
  );
};

const MyOven = () => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => {
    setIsOn(prev => !prev);
  };

  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 60 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'orange' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <GasStove isOn={isOn} toggle={toggle} />
      <HighQualityPot isOn={isOn} />
      <OrbitControls />
    </Canvas>
  );
};

export default MyOven;
