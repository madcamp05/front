import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import './my_sink.css';

const MySink = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Create a bowl (outer part)
    const outerGeometry = new THREE.CylinderGeometry(5, 5, 3, 32, 1, true);
    const outerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const outerBowl = new THREE.Mesh(outerGeometry, outerMaterial);
    outerBowl.rotation.x = Math.PI / 2;
    outerBowl.castShadow = true;
    outerBowl.receiveShadow = true;
    scene.add(outerBowl);

    // Create the inner part of the bowl
    const innerGeometry = new THREE.CylinderGeometry(4.5, 4.5, 2.8, 32);
    const innerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const innerBowl = new THREE.Mesh(innerGeometry, innerMaterial);
    innerBowl.rotation.x = Math.PI / 2;
    innerBowl.position.z = -0.1; // Slightly adjust position to avoid z-fighting
    innerBowl.castShadow = true;
    innerBowl.receiveShadow = true;
    scene.add(innerBowl);

    // Create dirty texture
    const dirtCanvas = document.createElement('canvas');
    const size = 1024;
    dirtCanvas.width = size;
    dirtCanvas.height = size;
    const dirtContext = dirtCanvas.getContext('2d');

    // Fill the canvas with random dirt pattern
    const createDirtPattern = () => {
      dirtContext.fillStyle = '#654321'; // brown color for dirt
      dirtContext.fillRect(0, 0, size, size);
      for (let i = 0; i < 50000; i++) { // Increase number of dirt spots
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 3; // Decrease radius for more density
        dirtContext.beginPath();
        dirtContext.arc(x, y, radius, 0, Math.PI * 2, false);
        dirtContext.fillStyle = 'rgba(0, 0, 0, 0.5)'; // darker spots
        dirtContext.fill();
      }
    };

    createDirtPattern();

    const dirtTextureFromCanvas = new THREE.CanvasTexture(dirtCanvas);
    const dirtMaterial = new THREE.MeshPhongMaterial({ map: dirtTextureFromCanvas, transparent: true });
    const dirt = new THREE.Mesh(innerGeometry, dirtMaterial);
    innerBowl.add(dirt);

    // Create soap bubbles group
    const bubbleGroup = new THREE.Group();
    scene.add(bubbleGroup);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 10;

    // Mouse movement handling for rotation and cleaning
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Rotate camera based on mouse position
      camera.position.x = mouse.x * 10;
      camera.position.y = mouse.y * 10;
      camera.lookAt(scene.position);

      // Cleaning effect
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([dirt]);

      if (intersects.length > 0) {
        const uv = intersects[0].uv;
        const brushSize = 40;
        dirtContext.clearRect((uv.x * size) - brushSize / 2, (1 - uv.y) * size - brushSize / 2, brushSize, brushSize); // Clear a larger area
        dirtTextureFromCanvas.needsUpdate = true;

        // Create soap bubbles
        createSoapBubble(intersects[0].point);
      }
    };

    const createSoapBubble = (position) => {
      const bubbleGeometry = new THREE.SphereGeometry(0.3, 16, 16); // Larger bubbles
      const bubbleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true });
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      bubble.position.copy(position);
      bubbleGroup.add(bubble);

      // Animate bubble
      new TWEEN.Tween(bubble.position)
        .to({ y: bubble.position.y + 1 }, 2000)
        .onComplete(() => bubbleGroup.remove(bubble))
        .start();
    };

    window.addEventListener('mousemove', onMouseMove);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="sink-container"></div>;
};

export default MySink;
