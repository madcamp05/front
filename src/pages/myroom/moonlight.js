import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
// import SimplexNoise from 'simplex-noise';

const Banana = ({ onClick, lightColor }) => {
    const bananaRef = React.useRef();

    // Define the banana shape using more vectors for a smoother and longer curve
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(-4, 1, 0),
        new THREE.Vector3(-3, 1.5, 0),
        new THREE.Vector3(-2, 2, 0),
        new THREE.Vector3(-1, 2.5, 0),
        new THREE.Vector3(0, 3, 0),
        new THREE.Vector3(1, 2.5, 0),
        new THREE.Vector3(2, 2, 0),
        new THREE.Vector3(3, 1.5, 0),
        new THREE.Vector3(4, 1, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(4, -1, 0),
        new THREE.Vector3(3, -1.5, 0),
        new THREE.Vector3(2, -2, 0),
        new THREE.Vector3(1, -2.5, 0),
        new THREE.Vector3(0, -3, 0),
        new THREE.Vector3(-1, -2.5, 0),
        new THREE.Vector3(-2, -2, 0),
        new THREE.Vector3(-3, -1.5, 0),
        new THREE.Vector3(-4, -1, 0),
        new THREE.Vector3(-5, 0, 0),
    ]);

    const points = curve.getPoints(200);  // More points for a smoother shape
    const geometry = new THREE.LatheGeometry(points, 32);

    // Scale the geometry to make it look more like a banana
    geometry.scale(0.5, 2.5, 0.5);

    // Rotate the geometry
    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI / 6);

    // Create bumpiness
    // const vertices = geometry.attributes.position.array;
    // const noise = new SimplexNoise();

    // for (let i = 0; i < vertices.length; i += 3) {
    //     const x = vertices[i];
    //     const y = vertices[i + 1];
    //     const z = vertices[i + 2];
    //     const nx = noise.noise3D(x * 0.1, y * 0.1, z * 0.1);
    //     const ny = noise.noise3D(x * 0.1 + 100, y * 0.1 + 100, z * 0.1 + 100);
    //     const nz = noise.noise3D(x * 0.1 + 200, y * 0.1 + 200, z * 0.1 + 200);
    //     vertices[i] += nx * 0.2;
    //     vertices[i + 1] += ny * 0.2;
    //     vertices[i + 2] += nz * 0.2;
    // }

    // geometry.attributes.position.needsUpdate = true;
    // geometry.computeVertexNormals();


    useFrame(() => {
        if (bananaRef.current) {
            bananaRef.current.rotation.y += 0.01;
        }
    });

    return (
        <>
            <mesh ref={bananaRef} geometry={geometry} onClick={onClick}>
                <meshLambertMaterial color={0xffff00} emissive={0xffff33} emissiveIntensity={0.05} />
            </mesh>
            <pointLight position={[0, 0, 0]} color={lightColor} intensity={2} distance={30} decay={1} />
        </>
    );
};

const BananaLight = () => {
    const [colorIndex, setColorIndex] = useState(0);
    const colors = [0xffe135, 0xff69b4, 0x87cefa, 0xffd700, 0xadff2f]; // Array of cute colors

    const handleClick = () => {
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 20] }}>
                <color attach="background" args={['#0d1b2a']} />
                <ambientLight intensity={0.2} />
                <Banana onClick={handleClick} lightColor={colors[colorIndex]} />
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default BananaLight;
