import * as THREE from 'three';
import { WEBGL } from '../webgl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js';

document.addEventListener('DOMContentLoaded', (event) => {
  if (WEBGL.isWebGLAvailable()) {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const initialCameraPosition = { x: 20, y: 15, z: 20 };
    camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
    camera.lookAt(0, 5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

    // Additional light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // House materials
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    // House geometries
    const wallGeometry = new THREE.BoxGeometry(20, 10, 1);
    const sideWallGeometry = new THREE.BoxGeometry(1, 10, 20);
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const roofGeometry = new THREE.BoxGeometry(18, 1, 24);
    const doorGeometry = new THREE.BoxGeometry(2.5, 5, 0.1);

    // Walls
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.position.set(0, 5, -10);
    scene.add(frontWall);

    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 5, 10);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-10, 5, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(10, 5, 0);
    scene.add(rightWall);

    // Roof parts
    const roofPart1 = new THREE.Mesh(roofGeometry, roofMaterial);
    roofPart1.rotation.z = Math.PI / 4;
    roofPart1.position.set(-6, 14, 0); // Adjust position to start at the top of the house
    scene.add(roofPart1);

    const roofPart2 = new THREE.Mesh(roofGeometry, roofMaterial);
    roofPart2.rotation.z = -Math.PI / 4;
    roofPart2.position.set(6, 14, 0); // Adjust position to start at the top of the house
    scene.add(roofPart2);

    // Floor
    const floor = new THREE.Mesh(floorGeometry, new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor)

    const behindDoorMaterial = new THREE.MeshStandardMaterial({ color: 0xfff7cc });
    const behindDoor = new THREE.Mesh(doorGeometry, behindDoorMaterial);
    behindDoor.position.set(0, 3, 10.5); // Adjusted position to be directly behind the door
    scene.add(behindDoor);

    // Add door
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    
    // Create door group and adjust pivot point
    const doorGroup = new THREE.Group();
    door.position.set(doorGeometry.parameters.width / 2, 0, 0); // Offset door to pivot around right edge
    doorGroup.add(door);
    doorGroup.position.set(-1, 3, 10.6); // Set the door group position
    scene.add(doorGroup);

    // Door open/close logic
    let doorOpen = false;
    function toggleDoor() {
      const doorRotationTarget = doorOpen ? 0 : -Math.PI / 2; // Change rotation direction to opposite
      doorOpen = !doorOpen;

      new TWEEN.Tween(doorGroup.rotation)
        .to({ y: doorRotationTarget }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          if (doorOpen) {
            window.location.href = 'login.js'; // Redirect to login.js
          }
        })
        .start();
    }

    // Event listener for door click
    window.addEventListener('click', (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([door, behindDoor]);

      if (intersects.length > 0) {
        toggleDoor();
      }
    });

    // Mouse control variables
    let mouseY = 0;
    let zoom = 1.5;
    const minZoom = 1.4; // Set the minimum zoom level
    const maxZoom = 2;

    document.addEventListener('mousemove', (event) => {
      mouseY = -(event.clientY / window.innerHeight) * 4 + 2; // Increased vertical movement range

      // Clamp mouseY to restrict vertical movement
      const maxAngleY = 2; // Increased this value to allow more vertical movement
      mouseY = Math.max(Math.min(mouseY, maxAngleY), -maxAngleY);
    });

    document.addEventListener('wheel', (event) => {
      event.preventDefault(); // Prevent the default scroll behavior
      zoom += event.deltaY * 0.001; // Adjust zoom sensitivity as needed
      zoom = Math.min(Math.max(minZoom, zoom), maxZoom); // Limit zoom range, ensuring the camera doesn't get too close
    });

    function animate() {
      requestAnimationFrame(animate);

      // Update camera position based on mouse
      const cameraDistance = Math.sqrt(Math.pow(initialCameraPosition.x, 2) + Math.pow(initialCameraPosition.z, 2)) * zoom;

      camera.position.x = initialCameraPosition.x; // Fix the horizontal position
      camera.position.z = cameraDistance; // Fix the horizontal position
      camera.position.y = initialCameraPosition.y + mouseY * 3; // Allow more vertical movement
      camera.lookAt(0, 5, 0);

      // Update TWEEN
      TWEEN.update();

      renderer.render(scene, camera);
    }
    animate();

    // Responsive handling
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
  }
});
