import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const initialMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const Confetti = ({ position }) => {
    const confettiRef = useRef();
    const confettiParticles = useRef([]);

    useEffect(() => {
        const colors = ["#ff0f0f", "#0f0fff", "#0fff0f", "#ff0fff", "#ffff0f", "#0fffff"];
        const particleCount = 100;

        const addParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                const geometry = new THREE.PlaneGeometry(0.1, 0.2);
                const material = new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random() * colors.length)] });
                const particle = new THREE.Mesh(geometry, material);

                particle.position.set(
                    position.x + (Math.random() - 0.5) * 5,
                    position.y + (Math.random() - 0.5) * 5 + 2,
                    position.z + (Math.random() - 0.5) * 5 + 3.5
                );

                particle.rotation.set(
                    Math.random() * 2 * Math.PI,
                    Math.random() * 2 * Math.PI,
                    Math.random() * 2 * Math.PI
                );

                confettiParticles.current.push(particle);
                confettiRef.current.add(particle);
            }
        };

        addParticles();

        const interval = setInterval(addParticles, 1000); // 1초마다 confetti 추가

        return () => {
            clearInterval(interval);
            if (confettiRef.current) {
                confettiParticles.current.forEach(particle => {
                    confettiRef.current.remove(particle);
                });
            }
        };
    }, [position]);

    useFrame(() => {
        confettiParticles.current.forEach(particle => {
            particle.position.y -= 0.02;
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
        });
    });

    return <group ref={confettiRef} />;
};

const MazeGame = ({ position }) => {
    const [maze, setMaze] = useState(initialMap);
    const [showConfetti, setShowConfetti] = useState(false); // confetti 상태 추가
    const playerPos = useRef({ x: 1, y: 13 });

    const drawMaze = () => {
        return maze.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if (cell === 1) {
                    return (
                        <mesh key={`${rowIndex}-${colIndex}`} position={[colIndex - 7.5, 0, 7.5 - rowIndex]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshLambertMaterial color="#00FF2E" />
                        </mesh>
                    );
                } else if (cell === 3) {
                    return (
                        <mesh key={`${rowIndex}-${colIndex}`} position={[colIndex - 7.5, 0, 7.5 - rowIndex]}>
                            <sphereGeometry args={[0.4, 32, 32]} />
                            <meshLambertMaterial color="#ff0000" />
                        </mesh>
                    );
                } else {
                    return null;
                }
            })
        );
    };

    const handleKeyDown = (event) => {
        const { x, y } = playerPos.current;
        let newX = x;
        let newY = y;

        switch (event.key) {
            case 'ArrowUp':
                newY -= 1;
                break;
            case 'ArrowDown':
                newY += 1;
                break;
            case 'ArrowLeft':
                newX -= 1;
                break;
            case 'ArrowRight':
                newX += 1;
                break;
            default:
                return;
        }

        if (maze[newY][newX] !== 1) {
            const newMaze = maze.map(row => row.slice());
            newMaze[y][x] = 0;
            newMaze[newY][newX] = 3;
            setMaze(newMaze);
            playerPos.current = { x: newX, y: newY };

            if (maze[newY][newX] === 2) {
                setShowConfetti(true); // confetti 표시
                setTimeout(() => {
                    setShowConfetti(false); // confetti 숨기기
                    resetGame();
                }, 10000); // 10초 후에 confetti를 숨기고 게임 리셋
            }
        }
    };

    const resetGame = () => {
        setMaze(initialMap);
        playerPos.current = { x: 1, y: 13 };
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [maze]);

    return (
        <>
            {showConfetti && <Confetti position={{ x: 0, y: 0, z: 0 }} />} {/* confetti 컴포넌트 */}
            <group position={[0.1, -0.11, 0.1]} rotation={[Math.PI / 2, 3.14, 3.14]} scale={[3.2 / 15, 3.2 / 15, 3.2 / 15]}>
                {drawMaze()}
            </group>
        </>
    );
};

const GameConsole = () => {
    return (
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4, 6, 0.4]} />
            <meshLambertMaterial color="#d3d3d3" />
            <mesh position={[0, 1, 0.21]}>
                <boxGeometry args={[3.2, 3.2, 0.1]} />
                <meshLambertMaterial color="black" />
                {/* MazeGame 컴포넌트를 화면 부분에 추가 */}
                <MazeGame position={[0, 0, 0]} />
            </mesh>
            <mesh position={[-1, -1.8, 0.23]}>
                <boxGeometry args={[0.4, 1.3, 0.1]} />
                <meshLambertMaterial color="gray" />
            </mesh>
            <mesh position={[-1, -1.8, 0.23]}>
                <boxGeometry args={[1.3, 0.4, 0.1]} />
                <meshLambertMaterial color="gray" />
            </mesh>
            <mesh position={[0.55, -1.4, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
                <meshLambertMaterial color="red" />
            </mesh>
            <mesh position={[1.25, -2.1, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
                <meshLambertMaterial color="cyan" />
            </mesh>
        </mesh>
    );
};

const MiniGame = () => {
    // useEffect(() => {
    //     const audio = new Audio('/musics/background-music.mp3');
    //     audio.loop = true;
    //     audio.play();

    //     return () => {
    //         audio.pause();
    //         audio.currentTime = 0;
    //     };
    // }, []);

    return (
        <Canvas camera={{ position: [0, 0, 20] }} style={{ height: '100vh', width: '100vw' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <GameConsole />
            <OrbitControls />
        </Canvas>
    );
};

export default MiniGame;
