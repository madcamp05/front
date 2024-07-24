import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Book = ({ position, rotation, height, color, onClick, open }) => {
    const ref = useRef();

    return (
        <mesh
            ref={ref}
            position={position}
            rotation={rotation}
            onClick={onClick}
        >
            <boxGeometry args={open ? [0.1, height / 2, 1] : [0.5, height, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const Bookshelf = () => {
    const [openBook, setOpenBook] = useState(null);

    const handleBookClick = (index) => {
        setOpenBook(openBook === index ? null : index);
    };

    const bookCount = 10;
    const bookSpacing = 0.6; // 간격을 좁게 설정
    const centerOffset = -(bookCount * bookSpacing) / 2;

    const books = Array.from({ length: bookCount }).map((_, i) => ({
        height: Math.random() * 2 + 1,
        color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`).getStyle(),
        position: [centerOffset + i * bookSpacing, 0, 0],
        rotation: [0, Math.PI / 2, 0], // 책을 90도 돌리기
    }));

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
                {books.map((book, i) => (
                    <Book
                        key={i}
                        position={book.position}
                        rotation={book.rotation}
                        height={book.height}
                        color={book.color}
                        onClick={() => handleBookClick(i)}
                        open={openBook === i}
                    />
                ))}
            </Canvas>
        </div>
    );
};

export default Bookshelf;
