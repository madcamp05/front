import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Banana = () => {
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
    geometry.scale(0.2, 1, 0.2);

    // Rotate the geometry
    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI / 6);

    useFrame(() => {
        if (bananaRef.current) {
            bananaRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={bananaRef} geometry={geometry}>
            <meshStandardMaterial color={0xffff00} />
        </mesh>
    );
};

const BananaLight = () => {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 20] }}>
                <color attach="background" args={['#0d1b2a']} />
                <ambientLight intensity={0.2} />
                <Banana />
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default BananaLight;
