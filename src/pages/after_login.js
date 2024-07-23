import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { WEBGL } from '../webgl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { loadModels } from '../loaders/loadModels';

const AfterLogin = () => {
  const containerRef = useRef();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject = null;
  useEffect(() => {
    if (WEBGL.isWebGLAvailable()) {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xeeeeee);

      // Camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      const initialCameraPosition = { x: 10, y: 7, z: 10 };
      camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
      camera.lookAt(0, 0, 0);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      const container = document.getElementById('webgl-container');
      container.appendChild(renderer.domElement);

      // Light
      const pointLight = new THREE.PointLight(0xffffff, 0.9);
      pointLight.position.set(8, 10, 10);
      scene.add(pointLight);

      // Warm light
      const warmLight = new THREE.DirectionalLight(0xFFF7CA, 0.2); // Orange light
      warmLight.position.set(0, 5, 5); // Position the light
      scene.add(warmLight);

      // Load models & animate
      loadModels(scene, animate);

      function animate() {
        requestAnimationFrame(animate);

        const cameraDistance = Math.sqrt(Math.pow(initialCameraPosition.x, 2) + Math.pow(initialCameraPosition.z, 2)) * zoom;
        const angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x) + mouseX;

        camera.position.x = cameraDistance * Math.cos(angle);
        camera.position.z = cameraDistance * Math.sin(angle);
        camera.position.y = initialCameraPosition.y + mouseY * 3;
        camera.lookAt(0, 0, 0);

        // Perform raycasting to detect mouse hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Remove highlight from previously selected object
        if (selectedObject) {
          selectedObject.material.emissive.setHex(selectedObject.currentHex);
          selectedObject = null;
        }

        if (intersects.length > 0) {
          const object = intersects[0].object;
          if (object.isMesh) {
            selectedObject = object;
            selectedObject.currentHex = selectedObject.material.emissive.getHex();
            selectedObject.material.emissive.setHex(0xff0000); // Highlight color
          }
        }


        renderer.render(scene, camera);
      }

      // Additional warm light from above
      const warmLightAbove = new THREE.DirectionalLight(0xffa500, 0.3); // Orange light
      warmLightAbove.position.set(0, 10, 0); // Position the light above
      scene.add(warmLightAbove);

      // Materials
      const wallMaterial1 = new THREE.MeshStandardMaterial({ color: 0x999999 });
      const wallMaterial2 = new THREE.MeshStandardMaterial({ color: 0x999999 });
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1, // Reduce glossiness
      });

      // Geometry
      const wallGeometry = new THREE.PlaneGeometry(15, 15); // 수정: Larger walls to cover more area (10 -> 15)
      const floorGeometry = new THREE.PlaneGeometry(15, 15); // 수정: Larger floor to cover more area (10 -> 15)

      // Walls
      const wall1 = new THREE.Mesh(wallGeometry, wallMaterial1);
      wall1.position.set(0, 2.5, -7.5); // 수정: Move back further and adjust height
      scene.add(wall1);

      const wall2 = new THREE.Mesh(wallGeometry, wallMaterial2);
      wall2.rotation.y = Math.PI / 2;
      wall2.position.set(-7.5, 2.5, 0); // 수정: Move to the left further and adjust height
      scene.add(wall2);

      const wall3 = new THREE.Mesh(wallGeometry, wallMaterial1);
      wall3.rotation.y = -Math.PI / 2;
      wall3.position.set(7.5, 2.5, 0); // 수정: Move to the right further and adjust height
      scene.add(wall3);

      const wall4 = new THREE.Mesh(wallGeometry, wallMaterial1);
      wall4.rotation.y = Math.PI;
      wall4.position.set(0, 2.5, 7.5); // 수정: Move forward further and adjust height
      scene.add(wall4);

      // Floor
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -5; // Lower the floor
      scene.add(floor);

      // Mouse control variables
      let mouseX = 0, mouseY = 0;
      let zoom = 1.5;
      const minZoom = 1.4; // Set the minimum zoom level
      const maxZoom = 2;

      const mouseMoveHandler = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 4 + 2; // Increased vertical movement range
        // Update mouse coordinates for raycaster
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Clamp mouseX to restrict rotation angle
        const maxAngleX = 0.4; // Adjust this value to limit the rotation angle horizontally
        mouseX = Math.max(Math.min(mouseX, maxAngleX), -maxAngleX);

        // Clamp mouseY to restrict vertical movement
        const maxAngleY = 2; // Increased this value to allow more vertical movement
        mouseY = Math.max(Math.min(mouseY, maxAngleY), -maxAngleY);
      };

      const wheelHandler = (event) => {
        event.preventDefault(); // Prevent the default scroll behavior
        zoom += event.deltaY * 0.001; // Adjust zoom sensitivity as needed
        zoom = Math.min(Math.max(minZoom, zoom), maxZoom); // Limit zoom range, ensuring the camera doesn't get too close
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('wheel', wheelHandler);

      function render(time) {
        time *= 0.001; // convert time to seconds

        // Update camera position based on mouse
        const cameraDistance = Math.sqrt(Math.pow(initialCameraPosition.x, 2) + Math.pow(initialCameraPosition.z, 2)) * zoom;
        const angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x) + mouseX;

        camera.position.x = cameraDistance * Math.cos(angle);
        camera.position.z = cameraDistance * Math.sin(angle);
        camera.position.y = initialCameraPosition.y + mouseY * 3; // Allow more vertical movement
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);

      // Responsive handling
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener('resize', onWindowResize);

      // Mouse hover effect
      const onMouseMove = (event) => {
        // Update mouse coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Perform raycasting
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Remove highlight from previously selected object
        if (selectedObject) {
          selectedObject.material.emissive.setHex(selectedObject.currentHex);
          selectedObject = null;
        }

        if (intersects.length > 0) {
          const object = intersects[0].object;
          if (object.isMesh) {
            selectedObject = object;
            selectedObject.currentHex = selectedObject.material.emissive.getHex();
            selectedObject.material.emissive.setHex(0xff0000); // Highlight color
          }
        }
      };

      // Cleanup on component unmount
      return () => {
        container.removeChild(renderer.domElement);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('wheel', wheelHandler);
        window.removeEventListener('resize', onWindowResize);
      };
    } else {
      const warning = WEBGL.getWebGLErrorMessage();
      document.body.appendChild(warning);
    }
  }, []);

  return (
    <div>
      <div id="webgl-container"></div>
    </div>
  );
};

export default AfterLogin;
