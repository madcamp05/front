import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Bed = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a29); // Dark navy color

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);



        // Function to create a star shape
        const createStarShape = (radius, points) => {
            const shape = new THREE.Shape();
            const outerRadius = radius;
            const innerRadius = radius / 2;
            const angleStep = (Math.PI * 2) / points;

            shape.moveTo(outerRadius, 0);
            for (let i = 1; i < points * 2; i++) {
                const angle = i * angleStep;
                const r = i % 2 === 0 ? outerRadius : innerRadius;
                shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            shape.closePath();
            return shape;
        };

        // Material for stars
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xadff2f, side: THREE.DoubleSide }); // Fluorescent green color

        // Create and add stars to the scene
        const createStar = (size, x, y, z) => {
            const starShape = createStarShape(size, 5);
            const starGeometry = new THREE.ShapeGeometry(starShape);
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(x, y, z);
            return star;
        };

        for (let i = 0; i < 170; i++) {
            const size = Math.random() * 0.5;
            const x = (Math.random() - 0.5) * 55;
            const y = (Math.random() - 0.5) * 55;
            const z = (Math.random() - 1) * 20 - 1; // Spread stars further back
            const star = createStar(size, x, y, z);
            scene.add(star); // Add stars directly to the scene
        }

        // Function to create a planet shape
        const createPlanet = (size, color, x, y, z) => {
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
            const planetMaterial = new THREE.MeshBasicMaterial({ color: color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.position.set(x, y, z);
            planet.userData = { rotationSpeed: Math.random() * 0.001 + 0.0001 }; // Very slow rotation
            return planet;
        };

        // Colors for planets (cute pastel colors)
        const colors = [0xffc0cb, 0xffd700, 0xadd8e6, 0x90ee90, 0xffa07a]; // pink, gold, light blue, light green, light salmon

        // Create and add planets to the scene
        for (let i = 0; i < 6; i++) {
            const size = Math.random() * 0.8 + 0.2; // Planets are larger than stars
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 1) * 20 - 10; // Spread planets further back
            const color = colors[Math.floor(Math.random() * colors.length)];
            const planet = createPlanet(size, color, x, y, z);
            scene.add(planet);
        }

        // Create and add planets to the scene
        const planetGroups = [];
        for (let i = 0; i < 10; i++) {
            const size = Math.random() * 0.8 + 0.2; // Planets are larger than stars
            const distance = (Math.random() * 10) + 5; // Distance from the center
            const color = colors[Math.floor(Math.random() * colors.length)];

            const planetGroup = new THREE.Group();
            const planet = createPlanet(size, color, distance);
            planetGroup.add(planet);

            planetGroup.userData = { rotationSpeed: Math.random() * 0.1 + 0.001 }; // Very slow rotation
            planetGroups.push(planetGroup);
            scene.add(planetGroup);
        }

        // Mouse move event listener
        const onMouseMove = (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            camera.position.x = mouseX * 2;
            camera.position.y = mouseY * 2;
            camera.lookAt(scene.position);
        };

        document.addEventListener('mousemove', onMouseMove, false);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            // Rotate planet groups very slowly around the center
            planetGroups.forEach(group => {
                group.rotation.y += group.userData.rotationSpeed;
            });
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup on component unmount
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default Bed;
