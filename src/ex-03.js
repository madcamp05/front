import * as THREE from 'three';
import { WEBGL } from './webgl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const colors = [
  '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffcad4',
  '#ff6666', '#ff9933', '#ffff66', '#99ff99', '#6699ff', '#9966ff', '#ff66ff', '#ff6699',
  '#c93030', '#ec971f', '#8a8a2a', '#4cae4c', '#46b8da', '#5555aa', '#bb44bb', '#ac2925',
  '#f8f9fa', '#343a40'
];

function createColorModal(colors) {
  const modal = document.getElementById('colorModal');
  modal.innerHTML = '';
  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', () => selectColor(color));
    modal.appendChild(swatch);
  });
}

let selectedElement = null;

function selectColor(color) {
  if (selectedElement) {
    selectedElement.style.backgroundColor = color;
    const event = new Event('colorSelected');
    selectedElement.dispatchEvent(event);
    closeModal();
  }
}

function openModal(element) {
  selectedElement = element;
  document.getElementById('colorModal').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function closeModal() {
  document.getElementById('colorModal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

document.querySelectorAll('.color-button').forEach(button => {
  button.addEventListener('click', () => openModal(button));
});

document.getElementById('overlay').addEventListener('click', closeModal);

createColorModal(colors);

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

  // Warm light
  const warmLight = new THREE.DirectionalLight(0xffa500, 0.5); // Orange light
  warmLight.position.set(0, 5, 5); // Position the light
  scene.add(warmLight);

  //GLTF loader
  const loader = new GLTFLoader();
  loader.load('public/assets/gltf/barstool.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);

    model.position.set(0, -5, 0); // Position the model in the room
    scene.add(model);
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);  // 색상과 강도
    scene.add(ambientLight);
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight.position.set(0, 5, 5);  // 위치 설정
    // scene.add(dirLight);

  }, undefined, (error) => {
    console.error(error);
  });

  // Additional warm light from above
  const warmLightAbove = new THREE.DirectionalLight(0xffa500, 0.5); // Orange light
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

  // Furniture and decorations
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/mnt/data/image.png'); // Load your image as a texture
  const pictureGeometry = new THREE.PlaneGeometry(5, 5);
  const pictureMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
  picture.position.set(0, 2.5, -4.9);
  scene.add(picture);

  const chairGeometry = new THREE.BoxGeometry(1, 1, 1);
  const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const chair1 = new THREE.Mesh(chairGeometry, chairMaterial);
  chair1.position.set(-2, -4.5, -2);
  scene.add(chair1);

  const chair2 = chair1.clone();
  chair2.position.set(2, -4.5, -2);
  scene.add(chair2);

  const tableGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const table = new THREE.Mesh(tableGeometry, tableMaterial);
  table.position.set(0, -4.8, -2);
  scene.add(table);

  // Bookshelf
  const bookshelfGeometry = new THREE.BoxGeometry(1, 3, 0.5);
  const bookshelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const bookshelf = new THREE.Mesh(bookshelfGeometry, bookshelfMaterial);
  bookshelf.position.set(-4, -3.5, -4);
  scene.add(bookshelf);

  // Desk
  const deskGeometry = new THREE.BoxGeometry(2, 1, 1);
  const deskMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D });
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.set(3, -4.5, -3);
  scene.add(desk);

  // Bed
  const bedGeometry = new THREE.BoxGeometry(3, 1, 1.5);
  const bedMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
  const bed = new THREE.Mesh(bedGeometry, bedMaterial);
  bed.position.set(-2, -4.5, 3);
  scene.add(bed);

  // Lamp
  const lampGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
  const lampBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const lampShadeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFE0 });

  const lampBase = new THREE.Mesh(lampGeometry, lampBaseMaterial);
  lampBase.position.set(2, -4, 3);
  scene.add(lampBase);

  const lampShadeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
  const lampShade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial);
  lampShade.position.set(2, -3.25, 3);
  scene.add(lampShade);

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
  document.getElementById('wall1Color').addEventListener('colorSelected', (event) => {
    wallMaterial1.color.set(event.target.style.backgroundColor);
  });

  document.getElementById('wall2Color').addEventListener('colorSelected', (event) => {
    wallMaterial2.color.set(event.target.style.backgroundColor);
  });

  document.getElementById('floorColor').addEventListener('colorSelected', (event) => {
    floorMaterial.color.set(event.target.style.backgroundColor);
  });
} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
