// src/pages/myroom_effects/imac.js
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const IMac = () => {
    const iMacRef = useRef();
    const [text, setText] = useState('');

    // Animation loop
    useFrame(() => {
        iMacRef.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={iMacRef} position={[0, 0, 0]}>
            {/* iMac Screen */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[6, 4, 0.2]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* iMac Frame */}
            <mesh position={[0, 1, -0.1]}>
                <boxGeometry args={[6.4, 4.4, 0.2]} />
                <meshStandardMaterial color="#888888" />
            </mesh>

            {/* Base to Frame Connector */}
            {/* <mesh position={[0, -1.5, 0]}>
                <boxGeometry args={[0.5, 1.4, 0.2]} />
                <meshStandardMaterial color="#888888" />
            </mesh> */}

            {/* Base */}
            <mesh position={[0, -2.2, 0]}>
                <boxGeometry args={[2, 0.2, 2]} />
                <meshStandardMaterial color="#888888" />
            </mesh>

            {/* Textarea */}
            <Html position={[0, 1, 0.12]} transform>
                <div style={{ width: '6rem', height: '4rem', backgroundColor: 'white', overflow: 'auto' }}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'black' }}
                    />
                </div>
            </Html>
        </mesh>
    );
};

const IMacCanvas = () => {
    return (
        <Canvas style={{ width: '100vw', height: '100vh' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <IMac />
            <OrbitControls />
        </Canvas>
    );
};

export default IMacCanvas;
