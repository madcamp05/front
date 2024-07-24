import React, { useEffect } from 'react';
import * as THREE from 'three';
import { WEBGL } from '../webgl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModelsKitchen } from '../loadModelsKitchen';
import { useNavigate } from 'react-router-dom';
import { loadModels } from '../loaders/gameroomloadModels';

const MyGameRoom = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let renderer, scene, camera, animate, onWindowResize, onMouseClick;
        if (WEBGL.isWebGLAvailable()) {
            // Scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xeeeeee);

            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            const initialCameraPosition = { x: 10, y: 7, z: 10 };
            camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
            camera.lookAt(0, 0, 0);

            // Renderer
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            const container = document.getElementById('webgl-container');
            container.innerHTML = ''; // Ensure the container is empty
            container.appendChild(renderer.domElement);

            // Light
            const pointLight = new THREE.PointLight(0x6B61A9, 0.9);
            pointLight.position.set(8, 10, 10);
            scene.add(pointLight);

            //             // Warm light
            const warmLight = new THREE.DirectionalLight(0xFFD70E, 0.4); // Orange light
            warmLight.position.set(0, 5, 5); // Position the light
            scene.add(warmLight);

            //             // Additional warm light from above
            const warmLightAbove = new THREE.DirectionalLight(0xE50EFF, 0.1); // Orange light
            warmLightAbove.position.set(0, 10, 10); // Position the light above
            scene.add(warmLightAbove);

            // Load models & animate
            loadModels(scene, animate);

            // Raycaster and mouse vector for object selection
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            document.addEventListener('click', onMouseClick);

            function onMouseClick(event) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(scene.children, true);

                if (intersects.length > 0) {
                    const selectedObject = intersects[0].object;
                    console.log('Selected object:', selectedObject.name); // Debug statement
                    if (selectedObject.name === 'sss' || selectedObject.name === 'ssssssssssss001') {
                        console.log("selectedObject.name == minigame");
                        animateCameraToObject(selectedObject, '/game/minigame');
                    } else if (selectedObject.name === 'Moon_nightlight_LP_Plane.020') {
                        console.log("selectedObject.name == Moon_nightlight_LP_Plane.020");
                        animateCameraToObject(selectedObject, '/game/moonlight');
                    } else if (selectedObject.name === 'PedestalFan') {
                        console.log("selectedObject.name == PedestalFan");
                        animateCameraToObject(selectedObject, '/game/fan');
                    }
                }
            }

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
                        // Wait for 5 seconds before navigating
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
            }

            // Materials
            const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
            const floorMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 1, // Reduce glossiness
            });

            // Geometry
            const wallGeometry = new THREE.PlaneGeometry(15, 15);
            const floorGeometry = new THREE.PlaneGeometry(15, 15);

            // Walls
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

            // Floor
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

            onWindowResize = function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
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
                if (container && renderer.domElement) {
                    container.removeChild(renderer.domElement);
                }
            }
            window.removeEventListener('resize', onWindowResize);
            // document.removeEventListener('click', onMouseClick);
        };
    }, []);

    return (
        <div>
            <div id="webgl-container"></div>
        </div>
    );
};

export default MyGameRoom;

// import React, { useEffect } from 'react';
// import * as THREE from 'three';
// import { WEBGL } from '../webgl';
// import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
// import { loadModels } from '../loaders/gameroomloadModels';

// const colors = [
//     '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffcad4',
//     '#ff6666', '#ff9933', '#ffff66', '#99ff99', '#6699ff', '#9966ff', '#ff66ff', '#ff6699',
//     '#c93030', '#ec971f', '#8a8a2a', '#4cae4c', '#46b8da', '#5555aa', '#bb44bb', '#ac2925',
//     '#f8f9fa', '#343a40'
// ];

// function createColorModal(colors) {
//     const modal = document.getElementById('colorModal');
//     modal.innerHTML = '';
//     colors.forEach(color => {
//         const swatch = document.createElement('div');
//         swatch.className = 'color-swatch';
//         swatch.style.backgroundColor = color;
//         swatch.addEventListener('click', () => selectColor(color));
//         modal.appendChild(swatch);
//     });
// }

// let selectedElement = null;

// function selectColor(color) {
//     if (selectedElement) {
//         selectedElement.style.backgroundColor = color;
//         const event = new Event('colorSelected');
//         selectedElement.dispatchEvent(event);
//         closeModal();
//     }
// }

// function openModal(element) {
//     selectedElement = element;
//     document.getElementById('colorModal').style.display = 'block';
//     document.getElementById('overlay').style.display = 'block';
// }

// function closeModal() {
//     document.getElementById('colorModal').style.display = 'none';
//     document.getElementById('overlay').style.display = 'none';
// }


// const MyGameRoom = () => {
//     useEffect(() => {
//         document.querySelectorAll('.color-button').forEach(button => {
//             button.addEventListener('click', () => openModal(button));
//         });

//         document.getElementById('overlay').addEventListener('click', closeModal);
//         createColorModal(colors);

//         if (WEBGL.isWebGLAvailable()) {
//             // Scene
//             const scene = new THREE.Scene();
//             scene.background = new THREE.Color(0xeeeeee);

//             // Camera
//             const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
//             const initialCameraPosition = { x: 10, y: 7, z: 10 };
//             camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
//             camera.lookAt(0, 0, 0);

//             // Renderer
//             const renderer = new THREE.WebGLRenderer({
//                 antialias: true,
//                 alpha: true,
//             });
//             renderer.setSize(window.innerWidth, window.innerHeight);
//             document.getElementById('webgl-container').appendChild(renderer.domElement);

//             // Light
//             const pointLight = new THREE.PointLight(0x6B61A9, 0.9);
//             pointLight.position.set(8, 10, 10);
//             scene.add(pointLight);

//             // Warm light
//             const warmLight = new THREE.DirectionalLight(0xFFD70E, 0.4); // Orange light
//             warmLight.position.set(0, 5, 5); // Position the light
//             scene.add(warmLight);

//             // Additional warm light from above
//             const warmLightAbove = new THREE.DirectionalLight(0xE50EFF, 0.1); // Orange light
//             warmLightAbove.position.set(0, 10, 10); // Position the light above
//             scene.add(warmLightAbove);

//             // Load models & animate
//             loadModels(scene, animate);

//             function animate() {
//                 requestAnimationFrame(animate);

//                 const cameraDistance = Math.sqrt(Math.pow(initialCameraPosition.x, 2) + Math.pow(initialCameraPosition.z, 2)) * zoom;
//                 const angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x) + mouseX;

//                 camera.position.x = cameraDistance * Math.cos(angle);
//                 camera.position.z = cameraDistance * Math.sin(angle);
//                 camera.position.y = initialCameraPosition.y + mouseY * 3;
//                 camera.lookAt(0, 0, 0);

//                 renderer.render(scene, camera);
//             }

//             // Materials
//             const wallMaterial1 = new THREE.MeshStandardMaterial({ color: 0x999999 });
//             const wallMaterial2 = new THREE.MeshStandardMaterial({ color: 0x999999 });
//             const floorMaterial = new THREE.MeshStandardMaterial({
//                 color: 0xffffff,
//                 roughness: 1, // Reduce glossiness
//             });

//             // Geometry
//             const wallGeometry = new THREE.PlaneGeometry(15, 15); // 수정: Larger walls to cover more area (10 -> 15)
//             const floorGeometry = new THREE.PlaneGeometry(15, 15); // 수정: Larger floor to cover more area (10 -> 15)

//             // Walls
//             const wall1 = new THREE.Mesh(wallGeometry, wallMaterial1);
//             wall1.position.set(0, 2.5, -7.5); // 수정: Move back further and adjust height
//             scene.add(wall1);

//             const wall2 = new THREE.Mesh(wallGeometry, wallMaterial2);
//             wall2.rotation.y = Math.PI / 2;
//             wall2.position.set(-7.5, 2.5, 0); // 수정: Move to the left further and adjust height
//             scene.add(wall2);

//             const wall3 = new THREE.Mesh(wallGeometry, wallMaterial1);
//             wall3.rotation.y = -Math.PI / 2;
//             wall3.position.set(7.5, 2.5, 0); // 수정: Move to the right further and adjust height
//             scene.add(wall3);

//             const wall4 = new THREE.Mesh(wallGeometry, wallMaterial1);
//             wall4.rotation.y = Math.PI;
//             wall4.position.set(0, 2.5, 7.5); // 수정: Move forward further and adjust height
//             scene.add(wall4);

//             // Floor
//             const floor = new THREE.Mesh(floorGeometry, floorMaterial);
//             floor.rotation.x = -Math.PI / 2;
//             floor.position.y = -5; // Lower the floor
//             scene.add(floor);

//             // Mouse control variables
//             let mouseX = 0, mouseY = 0;
//             let zoom = 1.5;
//             const minZoom = 1.4; // Set the minimum zoom level
//             const maxZoom = 2;

//             document.addEventListener('mousemove', (event) => {
//                 mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//                 mouseY = -(event.clientY / window.innerHeight) * 4 + 2; // Increased vertical movement range

//                 // Clamp mouseX to restrict rotation angle
//                 const maxAngleX = 0.4; // Adjust this value to limit the rotation angle horizontally
//                 mouseX = Math.max(Math.min(mouseX, maxAngleX), -maxAngleX);

//                 // Clamp mouseY to restrict vertical movement
//                 const maxAngleY = 2; // Increased this value to allow more vertical movement
//                 mouseY = Math.max(Math.min(mouseY, maxAngleY), -maxAngleY);
//             });

//             document.addEventListener('wheel', (event) => {
//                 event.preventDefault(); // Prevent the default scroll behavior
//                 zoom += event.deltaY * 0.001; // Adjust zoom sensitivity as needed
//                 zoom = Math.min(Math.max(minZoom, zoom), maxZoom); // Limit zoom range, ensuring the camera doesn't get too close
//             });

//             function render(time) {
//                 time *= 0.001; // convert time to seconds

//                 // Update camera position based on mouse
//                 const cameraDistance = Math.sqrt(Math.pow(initialCameraPosition.x, 2) + Math.pow(initialCameraPosition.z, 2)) * zoom;
//                 const angle = Math.atan2(initialCameraPosition.z, initialCameraPosition.x) + mouseX;

//                 camera.position.x = cameraDistance * Math.cos(angle);
//                 camera.position.z = cameraDistance * Math.sin(angle);
//                 camera.position.y = initialCameraPosition.y + mouseY * 3; // Allow more vertical movement
//                 camera.lookAt(0, 0, 0);

//                 renderer.render(scene, camera);
//                 requestAnimationFrame(render);
//             }
//             requestAnimationFrame(render);

//             // Responsive handling
//             function onWindowResize() {
//                 camera.aspect = window.innerWidth / window.innerHeight;
//                 camera.updateProjectionMatrix();
//                 renderer.setSize(window.innerWidth, window.innerHeight);
//             }
//             window.addEventListener('resize', onWindowResize);

//             // Color input handlers
//             document.getElementById('wall1Color').addEventListener('colorSelected', (event) => {
//                 wallMaterial1.color.set(event.target.style.backgroundColor);
//             })

//             document.getElementById('wall2Color').addEventListener('colorSelected', (event) => {
//                 wallMaterial2.color.set(event.target.style.backgroundColor);
//             });

//             document.getElementById('floorColor').addEventListener('colorSelected', (event) => {
//                 floorMaterial.color.set(event.target.style.backgroundColor);
//             });
//         } else {
//             const warning = WEBGL.getWebGLErrorMessage();
//             document.body.appendChild(warning);
//         }

//         // Cleanup on component unmount
//         return () => {
//             document.querySelectorAll('.color-button').forEach(button => {
//                 button.removeEventListener('click', () => openModal(button));
//             });
//             document.getElementById('overlay').removeEventListener('click', closeModal);
//         };
//     }, []);

//     return (
//         <div>
//             <div id="webgl-container"></div>
//             <div id="colorModal" className="color-modal"></div>
//             <div id="overlay" className="overlay"></div>
//             <div className="controls">
//                 <button id="wall1Color" className="color-button">Change Wall 1 Color</button>
//                 <button id="wall2Color" className="color-button">Change Wall 2 Color</button>
//                 <button id="floorColor" className="color-button">Change Floor Color</button>
//             </div>
//         </div>
//     );
// };

// export default MyGameRoom;
