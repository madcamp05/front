import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Custom Cream Component
const Cream = ({ position, onClick }) => {
  const creamRef = useRef();

  useEffect(() => {
    // Create the custom woven cream pattern
    const radius = 3;
    const segments = 64;
    const rings = 32;
    const geometry = new THREE.SphereGeometry(radius, segments, rings);
    const positionAttribute = geometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      let angle = Math.atan2(y, x);
      let dist = Math.sqrt(x * x + y * y);

      if (dist < radius) {
        const newZ = Math.sin(angle * 10 + dist * 3) * 0.3; // Wavy pattern
        positionAttribute.setZ(i, newZ);
      }
    }

    geometry.attributes.position.needsUpdate = true;
    creamRef.current.geometry = geometry;
  }, []);

  return (
    <mesh ref={creamRef} rotation={[-Math.PI / 2, 0, 0]} position={position} onClick={onClick}>
      <sphereGeometry args={[3, 64, 32]} />
      <meshPhysicalMaterial
        color="white"
        transmission={1}
        opacity={0.8}
        roughness={0.5}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
};

// Cake base component
const CakeBase = ({ onClick }) => {
  return (
    <mesh position={[0, -0.5, 0]} onClick={onClick}>
      <cylinderGeometry args={[3, 3, 1, 64]} />
      <meshStandardMaterial color="#8B4513" roughness={0.5} metalness={0.1} />
    </mesh>
  );
};

// Cake cream layer component
const CakeCreamLayer = ({ onClick }) => {
  return (
    <mesh position={[0, 0.5, 0]} onClick={onClick}>
      <cylinderGeometry args={[3, 3, 1, 64]} />
      <meshStandardMaterial color="#FFF5EE" roughness={0.8} metalness={0.2} />
    </mesh>
  );
};

// Mango cube component
const MangoCube = ({ position, rotation, onClick }) => {
  return (
    <mesh position={position} rotation={rotation} onClick={onClick}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.8} />
    </mesh>
  );
};

// Mango layer component
const MangoLayer = ({ onClick }) => {
  const mangoCubes = [];
  const mangoPositions = [
    [0, 1.5, 0], [0.5, 1.5, 0.5], [-0.5, 1.5, -0.5],
    [1, 1.5, 1], [-1, 1.5, -1], [1.5, 1.5, 0], [-1.5, 1.5, 0],
    [0, 1.5, 1.5], [0, 1.5, -1.5], [1.5, 1.5, 1.5], [-1.5, 1.5, -1.5],
    [1.5, 1.5, -1.5], [-1.5, 1.5, 1.5], [0.5, 1.5, -0.5], [-0.5, 1.5, 0.5]
  ];

  mangoPositions.forEach((pos, index) => {
    mangoCubes.push(
      <MangoCube key={index} position={pos} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]} onClick={onClick} />
    );
  });

  return <group>{mangoCubes}</group>;
};

// Cherry component
const Cherry = ({ position, rotation, onClick }) => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.2, 0.1),
    new THREE.Vector3(0, 0.4, 0.2),
    new THREE.Vector3(0, 0.6, 0.15),
    new THREE.Vector3(0, 0.8, 0)
  ]);

  const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="red" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh geometry={tubeGeometry} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
};

// Cherry layer component
const CherryLayer = ({ onClick }) => {
  const cherries = [];
  const cherryPositions = [
    [0.5, 2, 0.5], [-0.5, 2, -0.5], [0.5, 2, -0.5], [-0.5, 2, 0.5], [0, 2, 0.3], [0, 2, -0.3]
  ];

  cherryPositions.forEach((pos, index) => {
    cherries.push(
      <Cherry key={index} position={pos} rotation={[Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1]} onClick={onClick} />
    );
  });

  return <group>{cherries}</group>;
};

// Cake component
const Cake = ({ onRemove }) => {
  return (
    <group>
      <CakeBase onClick={() => onRemove('base')} />
      <CakeCreamLayer onClick={() => onRemove('creamLayer')} />
      <Cream position={[0, 1, 0]} onClick={() => onRemove('cream')} />
      <MangoLayer onClick={() => onRemove('mango')} />
      <CherryLayer onClick={() => onRemove('cherry')} />
    </group>
  );
};

// Plate component
const Plate = () => {
  return (
    <mesh position={[0, -1, 0]}>
      <cylinderGeometry args={[4, 4, 0.2, 64]} />
      <meshStandardMaterial color="black" roughness={0.5} metalness={0.5} />
    </mesh>
  );
};

// Main component
const MyTable = () => {
  const [components, setComponents] = useState({
    base: true,
    creamLayer: true,
    cream: true,
    mango: true,
    cherry: true,
  });

  const handleRemove = (component) => {
    setComponents((prev) => ({ ...prev, [component]: false }));
  };

  return (
    <Canvas style={{ background: 'pink', width: '100vw', height: '100vh' }}>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Plate />
      {components.base && <CakeBase onClick={() => handleRemove('base')} />}
      {components.creamLayer && <CakeCreamLayer onClick={() => handleRemove('creamLayer')} />}
      {components.cream && <Cream position={[0, 1, 0]} onClick={() => handleRemove('cream')} />}
      {components.mango && <MangoLayer onClick={() => handleRemove('mango')} />}
      {components.cherry && <CherryLayer onClick={() => handleRemove('cherry')} />}
      <OrbitControls />
    </Canvas>
  );
};

export default MyTable;
