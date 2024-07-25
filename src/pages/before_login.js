import React, { useEffect } from 'react';
import * as THREE from 'three';
import { WEBGL } from '../webgl';
import TWEEN from '@tweenjs/tween.js';
import { useNavigate } from 'react-router-dom';
import { TextureLoader } from 'three';

const BeforeLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let renderer, scene, camera, houseGroup, doorGroup, animate;
    if (WEBGL.isWebGLAvailable()) {
      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      // Camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      const initialCameraPosition = { x: 20, y: 15, z: 20 };
      camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
      camera.lookAt(0, 5, 0);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('webgl-container').appendChild(renderer.domElement);

      // Lights
      const light = new THREE.DirectionalLight(0xffffff, 0.9);
      const light2 = new THREE.DirectionalLight(0xffffff, 0.9);
      light.position.set(5, 5, 5).normalize();
      light2.position.set(3, 3, 3).normalize();
      scene.add(light);
      scene.add(light2);

      const ambientLight = new THREE.AmbientLight(0xffffff);
      // scene.add(ambientLight);

      // House materials
      const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

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
      doorGroup = new THREE.Group();
      door.position.set(doorGeometry.parameters.width / 2, 0, 0); // Offset door to pivot around right edge
      doorGroup.add(door);
      doorGroup.position.set(-1, 3, 10.6); // Set the door group position
      scene.add(doorGroup);



      // Create house group to move entire house
      houseGroup = new THREE.Group();
      houseGroup.add(frontWall);
      houseGroup.add(backWall);
      houseGroup.add(leftWall);
      houseGroup.add(rightWall);
      houseGroup.add(roofPart1);
      houseGroup.add(roofPart2);
      houseGroup.add(floor);
      houseGroup.add(behindDoor);
      houseGroup.add(doorGroup);
      scene.add(houseGroup);

      // fix: PNG 텍스처 로드 및 배치
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/assets/png/zipzoomW.png', (texture) => { // 경로 수정
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true, // 투명도 활성화
          alphaTest: 0.5 // 알파 값 테스트 기준 설정
        });
        const geometry = new THREE.PlaneGeometry(30, 8); // Increase size
        const pngMesh = new THREE.Mesh(geometry, material);
        pngMesh.position.set(5.3, -2, 11);
        // scene.add(pngMesh);
        houseGroup.add(pngMesh);
      });
      textureLoader.load('/assets/png/clickdoorW.png', (texture) => { // 경로 수정
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true, // 투명도 활성화
          alphaTest: 0.5 // 알파 값 테스트 기준 설정
        });
        const geometry2 = new THREE.PlaneGeometry(22, 20); // Increase size
        const pngMesh2 = new THREE.Mesh(geometry2, material);
        pngMesh2.rotation.x = -1.57;
        pngMesh2.position.set(22, 0, -1);
        houseGroup.add(pngMesh2);
        // scene.add(pngMesh2);
      });

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
              new TWEEN.Tween(houseGroup.position)
                .to({ x: houseGroup.position.x - 20 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                  document.getElementById('login-container').style.display = 'block';
                })
                .start();
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

      animate = function animate() {
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

    // Create and style login form
    const loginContainer = document.createElement('div');
    loginContainer.id = 'login-container';
    loginContainer.style.display = 'none';
    loginContainer.style.position = 'absolute';
    loginContainer.style.top = '50%';
    loginContainer.style.right = '10%';
    loginContainer.style.transform = 'translateY(-50%)';
    loginContainer.style.width = '300px';
    loginContainer.style.padding = '20px';
    loginContainer.style.backgroundColor = '#fff';
    loginContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    loginContainer.style.borderRadius = '10px';
    loginContainer.style.zIndex = '1000';

    const loginTitle = document.createElement('h2');
    loginTitle.innerText = 'Login';
    loginTitle.style.textAlign = 'center';
    loginContainer.appendChild(loginTitle);

    const loginForm = document.createElement('form');

    const usernameLabel = document.createElement('label');
    usernameLabel.innerText = 'Username:';
    usernameLabel.style.display = 'block';
    usernameLabel.style.marginTop = '10px';
    loginForm.appendChild(usernameLabel);

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.style.width = '100%';
    usernameInput.style.padding = '10px';
    usernameInput.style.marginTop = '5px';
    usernameInput.style.boxSizing = 'border-box';
    usernameInput.required = true;
    loginForm.appendChild(usernameInput);

    const passwordLabel = document.createElement('label');
    passwordLabel.innerText = 'Password:';
    passwordLabel.style.display = 'block';
    passwordLabel.style.marginTop = '10px';
    loginForm.appendChild(passwordLabel);

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '10px';
    passwordInput.style.marginTop = '5px';
    passwordInput.style.boxSizing = 'border-box';
    passwordInput.required = true;
    loginForm.appendChild(passwordInput);

    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.innerText = 'Login';
    loginButton.style.width = '100%';
    loginButton.style.padding = '10px';
    loginButton.style.marginTop = '20px';
    loginButton.style.backgroundColor = '#4CAF50';
    loginButton.style.color = '#fff';
    loginButton.style.border = 'none';
    loginButton.style.borderRadius = '5px';
    loginButton.style.cursor = 'pointer';
    loginForm.appendChild(loginButton);

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = usernameInput.value;
      const password = passwordInput.value;

      try {
        const response = await fetch('http://34.45.235.80:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        console.log("after fetching", username, password);
        console.log("response", response);

        if (response.ok) {
          const data = await response.json();
          const token = data.token;

          // Store the token in localStorage
          localStorage.setItem('token', token);

          alert('Login successful!');
          document.getElementById('login-container').style.display = 'none';

          console.log("Navigating to /room");
          navigate('/room'); // React Router를 사용하여 페이지 전환
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`); s
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    });

    loginContainer.appendChild(loginForm);
    document.body.appendChild(loginContainer);


    return () => {
      // Clean up Three.js resources and DOM elements
      if (renderer) {
        renderer.dispose();
        document.getElementById('webgl-container').removeChild(renderer.domElement);
      }
      // window.removeEventListener('resize', onWindowResize);
      // window.removeEventListener('click', toggleDoor);
    };

  }, []);



  return <div id="webgl-container"></div>;
};

export default BeforeLogin;
