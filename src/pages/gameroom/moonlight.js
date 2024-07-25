import React, { useEffect } from 'react';
import * as THREE from 'three';

const MoonScene = () => {
  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;  // Enable shadow maps
    document.body.appendChild(renderer.domElement);

    // Add the Moon sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const bumpMap = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/earthbump1k.jpg');
    const normalMap = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/earthnormal1k.jpg');
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      bumpMap: bumpMap,
      bumpScale: 0.1,
      normalMap: normalMap,
    });
    const moon = new THREE.Mesh(geometry, material);
    moon.castShadow = true;  // Enable casting shadows
    scene.add(moon);

    // Add a plane to receive the shadow
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -5;
    plane.receiveShadow = true;  // Enable receiving shadows
    scene.add(plane);

    // Add a directional light to simulate sunlight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);  // Initial position of the light
    directionalLight.castShadow = true;  // Enable shadow casting
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the Moon for some animation
      moon.rotation.y += 0.01;

      // Move the directional light in a circular motion to simulate moon phases
      const time = Date.now() * 0.001;
      directionalLight.position.set(Math.sin(time) * 5, Math.cos(time) * 5, 5);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default MoonScene;
