import * as THREE from 'three';
import { WEBGL } from '../webgl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000 }); // Red roof

    // House geometries
    const wallGeometry = new THREE.BoxGeometry(20, 10, 1);
    const sideWallGeometry = new THREE.BoxGeometry(1, 10, 20);
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const roofGeometry = new THREE.BoxGeometry(18, 1, 24); // Adjust width and height

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
    scene.add(floor);

    // Mouse control variables
    let mouseX = 0, mouseY = 0;
    let zoom = 1.5;
    const minZoom = 1.4; // Set the minimum zoom level
    const maxZoom = 2;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 4 + 2; // Increased vertical movement range

      // Clamp mouseX to restrict rotation angle
      const maxAngleX = 0.4; // Adjust this value to limit the rotation angle horizontally
      mouseX = Math.max(Math.min(mouseX, maxAngleX), -maxAngleX);

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
      const angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x) + mouseX;

      camera.position.x = cameraDistance * Math.cos(angle);
      camera.position.z = cameraDistance * Math.sin(angle);
      camera.position.y = initialCameraPosition.y + mouseY * 3; // Allow more vertical movement
      camera.lookAt(0, 5, 0);

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
