import * as THREE from 'three';
import { WEBGL } from './webgl';

if (WEBGL.isWebGLAvailable()) {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  const initialCameraPosition = { x: 8, y: 5, z: 8 };
  camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Light
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(8, 10, 10);
  scene.add(pointLight);

  // Materials
  const wallMaterial1 = new THREE.MeshStandardMaterial({ color: 0x999999 });
  const wallMaterial2 = new THREE.MeshStandardMaterial({ color: 0x999999 });
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1, // Reduce glossiness
  });

  // Geometry
  const wallGeometry = new THREE.PlaneGeometry(10, 10); // Larger walls to cover more area
  const floorGeometry = new THREE.PlaneGeometry(10, 10); // Larger floor to cover more area

  // Walls
  const wall1 = new THREE.Mesh(wallGeometry, wallMaterial1);
  wall1.position.set(0, 0, -5); // Move back further
  scene.add(wall1);

  const wall2 = new THREE.Mesh(wallGeometry, wallMaterial2);
  wall2.rotation.y = Math.PI / 2;
  wall2.position.set(-5, 0, 0); // Move to the left further
  scene.add(wall2);

  const wall3 = new THREE.Mesh(wallGeometry, wallMaterial1);
  wall3.rotation.y = -Math.PI / 2;
  wall3.position.set(5, 0, 0); // Move to the right further
  scene.add(wall3);

  const wall4 = new THREE.Mesh(wallGeometry, wallMaterial1);
  wall4.rotation.y = Math.PI;
  wall4.position.set(0, 0, 5); // Move forward further
  scene.add(wall4);

  // Floor
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -5; // Lower the floor
  scene.add(floor);

  // Function to create grid lines on a plane
  function createGrid(plane, rows, cols) {
    const gridHelper = new THREE.GridHelper(10, rows, 0x000000, 0x000000);
    gridHelper.rotation.x = Math.PI / 2;
    plane.add(gridHelper);
  }

  // Create grid on wall1
  createGrid(wall1, 10, 10);

  // Create grid on wall2
  createGrid(wall2, 10, 10);

  // Create grid on floor
  createGrid(floor, 10, 10);

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

  // Color input handlers
  document.getElementById('wall1Color').addEventListener('input', (event) => {
    wallMaterial1.color.set(event.target.value);
  });

  document.getElementById('wall2Color').addEventListener('input', (event) => {
    wallMaterial2.color.set(event.target.value);
  });

  document.getElementById('floorColor').addEventListener('input', (event) => {
    floorMaterial.color.set(event.target.value);
  });
} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
