import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ClockHand component representing each hand of the clock
const ClockHand = ({ length, color, rotationRef }) => (
  <mesh ref={rotationRef} position={[0, 0, 0.1]}>
    <boxGeometry args={[0.1, length, 0.1]} />
    <meshBasicMaterial color={color} />
  </mesh>
);

// ClockFace component representing the clock's face
const ClockFace = () => (
  <>
    <mesh position={[0, 0, 0.05]}>
      <circleGeometry args={[5, 64]} />
      <meshBasicMaterial color={'white'} />
    </mesh>
    <mesh position={[0, 0, -0.05]}>
      <circleGeometry args={[5, 64]} />
      <meshBasicMaterial color={'white'} />
    </mesh>
    {[...Array(12)].map((_, i) => (
      <mesh
        key={i}
        position={[Math.sin((i / 12) * Math.PI * 2) * 4.5, Math.cos((i / 12) * Math.PI * 2) * 4.5, 0]}
      >
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshBasicMaterial color={'black'} />
      </mesh>
    ))}
  </>
);

// ClockComponent handling the clock's hands and face
const ClockComponent = ({ handlePointerUp }) => {
  const hourRef = useRef();
  const secondRef = useRef();

  useFrame(() => {
    const date = new Date();
    const hours = date.getHours();
    const seconds = date.getSeconds();

    // Rotate hour hand
    hourRef.current.rotation.z = -((hours % 12) / 12) * Math.PI * 2;
    // Rotate second hand
    secondRef.current.rotation.z = -((seconds / 60) * Math.PI * 2);
  });

  return (
    <group
      scale={[0.5, 0.5, 0.5]}
      position={[0, 2, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();
        handlePointerUp();
      }}
    >
      <ClockFace />
      <ClockHand length={2} color="black" rotationRef={hourRef} />
      <ClockHand length={4.5} color="red" rotationRef={secondRef} />
    </group>
  );
};

// WaterSurface component to create a ripple effect
const WaterSurface = () => {
  const waterRef = useRef();
  const waterGeometry = useMemo(() => new THREE.PlaneGeometry(100, 100, 100, 100), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const position = waterGeometry.attributes.position;
    const waveHeight = 1; // Increased wave height for more pronounced motion
    const frequency1 = 0.2; // Increased frequency for tighter waves
    const frequency2 = 0.15;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const waveX = Math.sin(x * frequency1 + time) * waveHeight;
      const waveY = Math.cos(y * frequency2 + time * 0.5) * waveHeight;
      position.setZ(i, waveX + waveY);
    }
    position.needsUpdate = true;
  });

  return (
    <mesh ref={waterRef} geometry={waterGeometry} rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
      <meshStandardMaterial color={'#006d5b'} transparent opacity={0.6} />
    </mesh>
  );
};

// DarkBase component representing the dark base beneath the water
const DarkBase = () => (
  <mesh position={[0, -51, 0]}>
    <boxGeometry args={[100, 100, 100]} />
    <meshBasicMaterial color={'#006d5b'} />
  </mesh>
);

// FloatingGlassSphere component representing a floating glass sphere
const FloatingGlassSphere = ({ position, color, onPointerDown, onPointerUp }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.5;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerDown={(e) => onPointerDown(e, color, ref)}
      onPointerUp={onPointerUp}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.6}
        roughness={0.1}
        emissiveIntensity={1}
        transmission={0.9}
        thickness={1}
      />
      <pointLight
        color={color}
        intensity={1.5} // Adjust intensity as needed
        distance={5}
        position={position}
      />
    </mesh>
  );
};

// Array of colors for the glass spheres
const colors = [
  "#DC143C", // Crimson
  "#FF8C00", // Dark Orange
  "#FFD700", // Gold
  "#32CD32", // Lime Green
  "#00BFFF", // Deep Sky Blue
  "#4169E1", // Royal Blue
  "#483D8B", // Dark Slate Blue
  "#9370DB", // Medium Purple
  "#FF69B4"  // Hot Pink
];

// Generate a random position for the glass spheres
const getRandomPosition = () => {
  const x = Math.random() * 20 - 10;
  const z = Math.random() * 20 - 10;
  return [x, -0.5, z];
};

// GlassSpheres component to create multiple floating glass spheres
const GlassSpheres = ({ onPointerDown, onPointerUp }) => {
  const positions = useMemo(() => colors.map(() => getRandomPosition()), []);
  return (
    <>
      {colors.map((color, index) => (
        <FloatingGlassSphere
          key={index}
          color={color}
          position={positions[index]}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
      ))}
    </>
  );
};

// ClockScene component combining all parts of the scene
const ClockScene = ({ handlePointerDown, handlePointerUp }) => {
  const [pickedSphere, setPickedSphere] = useState(null);

  const onPointerDown = (e, color, ref) => {
    e.stopPropagation();
    setPickedSphere(ref.current);
    handlePointerDown(color);
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    setPickedSphere(null);
    handlePointerUp();
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (pickedSphere) {
        const newY = -(e.clientY / window.innerHeight) * 20 + 10;
        pickedSphere.position.x = (e.clientX / window.innerWidth) * 20 - 10;
        pickedSphere.position.y = newY > -1 ? newY : -1; // Keep the sphere above the water level
      }
    };

    if (pickedSphere) {
      document.addEventListener('pointermove', handlePointerMove);
    } else {
      document.removeEventListener('pointermove', handlePointerMove);
    }

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, [pickedSphere]);

  useFrame(() => {
    if (pickedSphere && pickedSphere.position.y <= -1) {
      // Release the sphere if it touches the water
      setPickedSphere(null);
      handlePointerUp();
    }
  });

  return (
    <>
      <ClockComponent handlePointerUp={handlePointerUp} />
      <WaterSurface />
      <DarkBase />
      <GlassSpheres onPointerDown={onPointerDown} onPointerUp={onPointerUp} />
    </>
  );
};

// Main Clock component
const Clock = () => {
  const [backgroundColor, setBackgroundColor] = useState('white');

  const handlePointerDown = (color) => {
    setBackgroundColor(color);
  };

  const handlePointerUp = () => {
    setBackgroundColor('white');
  };

  return (
    <Canvas style={{ height: '100vh', width: '100vw', backgroundColor }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <ClockScene handlePointerDown={handlePointerDown} handlePointerUp={handlePointerUp} />
      <OrbitControls />
    </Canvas>
  );
};

export default Clock;
