import React, { useEffect } from 'react';
import * as THREE from 'three';
import { WEBGL } from '../webgl';
import { loadModels } from '../loaders/loadModels';
import { useNavigate } from 'react-router-dom';

const AfterLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let renderer, scene, camera;
    let animate;
    let onWindowResize, onMouseClick;

    if (WEBGL.isWebGLAvailable()) {
      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      // Camera setup
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      const initialCameraPosition = { x: 10, y: 7, z: 10 };
      camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
      camera.lookAt(0, 0, 0);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      const container = document.getElementById('webgl-container');
      container.innerHTML = ''; // Ensure the container is empty
      container.appendChild(renderer.domElement);

      // Lights setup
      const pointLight = new THREE.PointLight(0xFF561B, 1);
      pointLight.position.set(8, 10, 10);
      scene.add(pointLight);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(10, 10, 10).normalize();
      scene.add(light);

      const warmLight = new THREE.DirectionalLight(0xFFF7CA, 0.8); // Orange light
      warmLight.position.set(0, 7, 3); // Position the light
      scene.add(warmLight);

      const warmLight2 = new THREE.DirectionalLight(0xFFF300, 0.4); // Orange light
      warmLight2.position.set(0, 5, 5); // Position the light
      scene.add(warmLight2);

      const warmLightAbove = new THREE.DirectionalLight(0xffa500, 0.5); // Orange light
      warmLightAbove.position.set(0, 10, 0); // Position the light above
      scene.add(warmLightAbove);

      // Load models & animate
      loadModels(scene, animate);

      // Raycaster and mouse vector for object selection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      onMouseClick = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          const selectedObject = intersects[0].object;
          //console.log("selectedObject === ", selectedObject.name);
          if (selectedObject.name === 'blanket') {
            animateCameraToObject(selectedObject, '/room/bed');
          } else if (selectedObject.name === 'panel_imac' || selectedObject.name === 'mouse') {
            animateCameraToObject(selectedObject, '/room/imac');
          } else if (selectedObject.name === 'object_1' ||
            selectedObject.name === 'object_17' ||
            selectedObject.name === 'object_16' ||
            selectedObject.name === 'object_18' ||
            selectedObject.name === 'object_13' ||
            selectedObject.name === 'object_12' ||
            selectedObject.name === 'object_7' ||
            selectedObject.name === 'object_15' ||
            selectedObject.name === 'object_19' ||
            selectedObject.name === 'object_4' ||
            selectedObject.name === 'object_16' ||
            selectedObject.name === 'object_6'
          ) {
            animateCameraToObject(selectedObject, '/room/bookshelf');
          } else if (selectedObject.name === 'mdlwc_2_pointer_plate') {
            animateCameraToObject(selectedObject, '/clock');
          }
        }
      };

      document.addEventListener('click', onMouseClick);

      function animateCameraToObject(object, navigateTo) {
        const targetPosition = new THREE.Vector3().copy(object.position);
        targetPosition.y += 2; // Adjust this value as needed for better zoom
        const startPosition = new THREE.Vector3().copy(camera.position);
        const startLookAt = new THREE.Vector3().copy(camera.getWorldDirection(new THREE.Vector3())).add(camera.position);

        const duration = 1000;
        const startTime = performance.now();

        function animate(time) {
          const elapsed = time - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const currentPosition = new THREE.Vector3().lerpVectors(startPosition, targetPosition, progress);
          camera.position.copy(currentPosition);

          const lookAtPosition = new THREE.Vector3().lerpVectors(startLookAt, targetPosition, progress);
          camera.lookAt(lookAtPosition);

          renderer.render(scene, camera);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setTimeout(() => {
              navigate(navigateTo);
            }, 100);
          }
        }

        requestAnimationFrame(animate);
      }

      animate = function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      // Materials and geometry setup
      const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
      const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });

      const wallGeometry = new THREE.PlaneGeometry(15, 15);
      const floorGeometry = new THREE.PlaneGeometry(15, 15);

      const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
      wall1.position.set(0, 2.5, -7.5);
      scene.add(wall1);

      const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
      wall2.rotation.y = Math.PI / 2;
      wall2.position.set(-7.5, 2.5, 0);
      scene.add(wall2);

      const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
      wall3.rotation.y = -Math.PI / 2;
      wall3.position.set(7.5, 2.5, 0);
      scene.add(wall3);

      const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
      wall4.rotation.y = Math.PI;
      wall4.position.set(0, 2.5, 7.5);
      scene.add(wall4);

      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -5;
      scene.add(floor);

      // Mouse control variables
      let mouseX = 0, mouseY = 0;
      let zoom = 1.5;
      const minZoom = 1.4;
      const maxZoom = 2;

      document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 4 + 2;

        const maxAngleX = 0.4;
        mouseX = Math.max(Math.min(mouseX, maxAngleX), -maxAngleX);

        const maxAngleY = 2;
        mouseY = Math.max(Math.min(mouseY, maxAngleY), -maxAngleY);
      });

      document.addEventListener('wheel', (event) => {
        event.preventDefault();
        zoom += event.deltaY * 0.001;
        zoom = Math.min(Math.max(minZoom, zoom), maxZoom);
      });

      function render(time) {
        time *= 0.001;

        const cameraDistance = Math.sqrt(Math.pow(initialCameraPosition.x, 2) + Math.pow(initialCameraPosition.z, 2)) * zoom;
        const angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x) + mouseX;

        camera.position.x = cameraDistance * Math.cos(angle);
        camera.position.z = cameraDistance * Math.sin(angle);
        camera.position.y = initialCameraPosition.y + mouseY * 3;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);

      onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize);
    } else {
      const warning = WEBGL.getWebGLErrorMessage();
      document.body.appendChild(warning);
    }

    return () => {
      // Clean up Three.js resources and DOM elements
      if (renderer) {
        renderer.dispose();
        const container = document.getElementById('webgl-container');
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('click', onMouseClick);
    };
  }, []);

  return (
    <div id="webgl-container"></div>
  );
};

export default AfterLogin;
