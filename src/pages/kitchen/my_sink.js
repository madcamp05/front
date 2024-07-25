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

    // Create the inner bowl
    const innerGeometry = new THREE.LatheGeometry(new THREE.SplineCurve([
      new THREE.Vector2(0, 0),
      new THREE.Vector2(3.5, 0),
      new THREE.Vector2(4.5, 1),
      new THREE.Vector2(5, 2),
      new THREE.Vector2(5, 3),
      new THREE.Vector2(4.5, 4)
    ]).getPoints(20), 32);
    const innerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // White color
    const innerBowl = new THREE.Mesh(innerGeometry, innerMaterial);
    innerBowl.rotation.x = Math.PI / 2;
    innerBowl.position.z = -0.1; // Slightly adjust position to avoid z-fighting
    innerBowl.castShadow = true;
    innerBowl.receiveShadow = true;
    scene.add(innerBowl);

    // Create dirty texture for outer part of inner bowl
    const dirtCanvasOuterInner = document.createElement('canvas');
    const size = 1024;
    dirtCanvasOuterInner.width = size;
    dirtCanvasOuterInner.height = size;
    const dirtContextOuterInner = dirtCanvasOuterInner.getContext('2d');

    // Fill the canvas with random dirt pattern
    const createDirtPattern = (context) => {
      context.fillStyle = '#654321'; // brown color for dirt
      context.fillRect(0, 0, size, size);
      for (let i = 0; i < 50000; i++) { // Increase number of dirt spots
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 3; // Decrease radius for more density
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fillStyle = 'rgba(0, 0, 0, 0.5)'; // darker spots
        context.fill();
      }
    };

    createDirtPattern(dirtContextOuterInner);

    const dirtTextureOuterInner = new THREE.CanvasTexture(dirtCanvasOuterInner);
    const dirtMaterialOuterInner = new THREE.MeshPhongMaterial({ map: dirtTextureOuterInner, transparent: true, side: THREE.DoubleSide });
    const dirtOuterInner = new THREE.Mesh(innerGeometry, dirtMaterialOuterInner);
    dirtOuterInner.rotation.y = Math.PI; // Rotate to place on the outer side of inner bowl
    innerBowl.add(dirtOuterInner);

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
    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Mouse movement handling for rotation and cleaning
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Slightly rotate camera based on mouse position
      camera.position.x = mouse.x * 5;
      camera.position.y = 5 + mouse.y * 2;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Cleaning effect
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([dirtOuterInner]);

      if (intersects.length > 0) {
        const uv = intersects[0].uv;
        const brushSize = 40;
        dirtContextOuterInner.clearRect((uv.x * size) - brushSize / 2, (1 - uv.y) * size - brushSize / 2, brushSize, brushSize); // Clear a larger area
        dirtTextureOuterInner.needsUpdate = true;

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

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up Three.js resources and DOM elements
      if (renderer) {
        renderer.dispose();
        const container = containerRef.current;
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <div ref={containerRef} className="sink-container"></div>;
};

export default MySink;
