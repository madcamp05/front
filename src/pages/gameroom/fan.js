import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Fan = ({ speed, setButtonState }) => {
  const bladeGroup = useRef();

  // Animation loop
  useFrame(() => {
    if (bladeGroup.current) {
      bladeGroup.current.rotation.z -= speed; // Rotate blades based on speed
    }
  });

  // Function to create a blade shape
  const createBladeShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.1, 0.5, 0.5, 0.8);
    shape.quadraticCurveTo(0.8, 0.9, 1, 0.5);
    shape.quadraticCurveTo(0.8, 0, 0.5, -0.3);
    shape.quadraticCurveTo(0.2, -0.5, 0, 0);
    return shape;
  };

  const bladeShape = createBladeShape();

  return (
    <group scale={[1.5, 1.5, 1.5]}>
      {/* Base */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[1.8, 0.4, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.6, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Motor housing */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Blades */}
      <group ref={bladeGroup} position={[0, 1.0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * 2 * Math.PI) / 3]}>
            <shapeGeometry args={[bladeShape]} />
            <meshStandardMaterial color="lightblue" side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Front Cover */}
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[1.1, 0.05, 16, 100]} />
        <meshStandardMaterial color="skyblue" side={THREE.DoubleSide} />
      </mesh>

      {/* Front Grill */}
      <mesh position={[0, 1.0, 0.1]}>
        <torusGeometry args={[0.9, 0.02, 16, 100]} />
        <meshStandardMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      {/* Grill spokes */}
      {Array.from({ length: 12 }).map((_, index) => (
        <mesh
          key={index}
          position={[0, 1.0, 0.1]}
          rotation={[0, 0, (index * Math.PI) / 6]}
        >
          <boxGeometry args={[0.02, 0.9, 0.02]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Buttons */}
      <group position={[0, -1.0, 0]}>
        {['red', 'green', 'yellow', 'black'].map((color, index) => (
          <mesh
            key={index}
            position={[(index - 1.5) * 0.5, 0, 0.40]} // Adjust y position to align with the top of the base
            onClick={() => setButtonState(index)}
          >
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Balloon = ({ fanSpeed }) => {
  const ref = useRef();
  const color = useMemo(() => {
    const colors = ['#FF69B4', '#FFD700', '#87CEEB', '#32CD32'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const [position, setPosition] = useState([Math.random() * 4 - 2, Math.random() * 4 + 2, Math.random() * 4 - 2]);

  useFrame((state) => {
    if (ref.current) {
      const newY = ref.current.position.y - 0.01;
      const flutter = Math.sin(state.clock.getElapsedTime() * 5) * 0.02;
      const windEffect = fanSpeed * 0.05; // Adjust the effect of the wind on the z-axis
      if (newY < -2) {
        ref.current.position.set(Math.random() * 4 - 2, Math.random() * 4 + 2, Math.random() * 4 - 2);
      } else {
        ref.current.position.y = newY;
        ref.current.rotation.z += flutter;
        ref.current.position.z += windEffect; // Move forward based on the fan speed
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const FanScene = () => {
  const [buttonState, setButtonState] = useState(0);

  const getSpeed = () => {
    switch (buttonState) {
      case 0:
        return 0;
      case 1:
        return 0.05;
      case 2:
        return 0.1;
      case 3:
        return 0.3;
      default:
        return 0;
    }
  };

  const fanSpeed = getSpeed();

  return (
    <Canvas style={{ height: '100vh', width: '100vw', background: 'lightpink'}}>
      <ambientLight intensity={0.8} /> {/* Single light source */}
      <Fan speed={fanSpeed} setButtonState={setButtonState} />
      <OrbitControls />
      <perspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />
      {Array.from({ length: 50 }).map((_, index) => (
        <Balloon key={index} fanSpeed={fanSpeed} />
      ))}
    </Canvas>
  );
};

export default FanScene;
