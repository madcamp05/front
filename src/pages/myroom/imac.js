// src/pages/myroom_effects/imac.js
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const IMac = () => {
    const iMacRef = useRef();
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [text3, setText3] = useState('');
    const [extraNotes, setExtraNotes] = useState([]);

    // Animation loop
    useFrame(() => {
        // iMacRef.current.rotation.y += 0.01;
    });

    const addNote = () => {
        setExtraNotes([...extraNotes, { text1, text2, text3 }]);
    };

    return (
        <>
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

                {/* Base */}
                <mesh position={[0, -1.7, -0.9]}>
                    <boxGeometry args={[2, 0.2, 2]} />
                    <meshStandardMaterial color="#888888" />
                </mesh>

                {/* Post-it 1 */}
                <Html position={[-1.5, 1.5, 0.12]} transform>
                    <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#FFEB3B', overflow: 'auto', padding: '0.5rem' }}>
                        <textarea
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                            style={{ width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'black' }}
                        />
                    </div>
                </Html>

                {/* Post-it 2 */}
                <Html position={[0, 1.5, 0.12]} transform>
                    <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#FFC107', overflow: 'auto', padding: '0.5rem' }}>
                        <textarea
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                            style={{ width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'black' }}
                        />
                    </div>
                </Html>

                {/* Post-it 3 */}
                <Html position={[1.5, 1.5, 0.12]} transform>
                    <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#FF9800', overflow: 'auto', padding: '0.5rem' }}>
                        <textarea
                            value={text3}
                            onChange={(e) => setText3(e.target.value)}
                            style={{ width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'black' }}
                        />
                    </div>
                </Html>

                {/* Button */}
                <Html position={[1.9, -0.2, 0.1]} transform>
                    <button onClick={addNote} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#E26E52', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.75rem' }}>
                        save
                    </button>
                </Html>
            </mesh>

            {/* Extra Notes */}
            {extraNotes.map((note, index) => (
                <Html key={index} position={[index * 4 - 4, -3, 0]} transform>
                    <div style={{ width: '10rem', backgroundColor: 'white', padding: '0.5rem', border: '1px solid black', }}>
                        <div style={{ backgroundColor: '#FFEB3B', padding: '1.5rem', marginBottom: '0.5rem' }}>{note.text1}</div>
                        <div style={{ backgroundColor: '#FFC107', padding: '1.5rem', marginBottom: '0.5rem' }}>{note.text2}</div>
                        <div style={{ backgroundColor: '#FF9800', padding: '1.5rem' }}>{note.text3}</div>
                    </div>
                </Html>
            ))}

            {/* Keyboard */}
            <mesh position={[0, -3, 2]}>
                <boxGeometry args={[7, 0.2, 2.5]} />
                <meshStandardMaterial color="#CCCCCC" />
                {[...Array(6)].map((_, row) =>
                    [...Array(14)].map((_, col) => (
                        <mesh key={`${row}-${col}`} position={[-3.2 + col * 0.5, 0.15, -1 + row * 0.35]}>
                            <boxGeometry args={[0.45, 0.1, 0.3]} />
                            <meshStandardMaterial color="#FFFFFF" />
                        </mesh>
                    ))
                )}
            </mesh>
        </>
    );
};

const SceneSetup = () => {
    const { scene } = useThree();
    scene.background = new THREE.Color('#FFF7DD');
    return null;
};

const IMacCanvas = () => {
    return (
        <Canvas style={{ width: '100vw', height: '100vh' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <SceneSetup />
            <IMac />
            <OrbitControls />
        </Canvas>
    );
};

export default IMacCanvas;
