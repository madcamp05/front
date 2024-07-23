// src/loadModels.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'; // 추가: FBX 로더
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js'; // 추가: TGA 로더

// 수정: 모델 로드 함수를 정의합니다.
export function loadModels(scene, onAllModelsLoaded) {
    const gltfLoader = new GLTFLoader();
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const fbxLoader = new FBXLoader(); // 추가: FBX 로더 인스턴스 생성
    const tgaLoader = new TGALoader(); // 추가: TGA 로더 인스턴스 생성

    const models = [
        { type: 'obj', objPath: '/assets/obj/gameroom/tv/tv.obj', mtlPath: '/assets/obj/gameroom/tv/tv.mtl', scale: 0.3, position: { x: -6.5, y: -2, z: 2 }, },
        { type: 'obj', objPath: '/assets/obj/gameroom/speaker/speaker.obj', mtlPath: '/assets/obj/gameroom/speaker/speaker.mtl', scale: 0.9, position: { x: -4.5, y: -3.5, z: -5 }, rotation: { y: Math.PI / 2 } },
        { type: 'obj', objPath: '/assets/obj/gameroom/speaker/speaker.obj', mtlPath: '/assets/obj/gameroom/speaker/speaker.mtl', scale: 0.9, position: { x: -4.5, y: -3.5, z: 6 }, rotation: { y: Math.PI / 2 } },
        { type: 'obj', objPath: '/assets/obj/gameroom/beanbag/beanbag.obj', mtlPath: '/assets/obj/gameroom/beanbag/beanbag.mtl', scale: 3, position: { x: 4.5, y: -5, z: 0.5 }, rotation: { y: Math.PI } },
        { type: 'obj', objPath: '/assets/obj/gameroom/playstation/playstation.obj', mtlPath: '/assets/obj/gameroom/playstation/playstation.mtl', scale: 0.010, position: { x: 0, y: -5, z: 5.5 }, rotation: { y: Math.PI / 2 + 0.7 } },
        { type: 'obj', objPath: '/assets/obj/gameroom/controller/controller.obj', mtlPath: '/assets/obj/gameroom/controller/controller.mtl', scale: 0.10, position: { x: 1, y: -5.5, z: 3.4 }, rotation: { y: Math.PI / 2 + 1.77, z: Math.PI + 2.17, } },
        { type: 'obj', objPath: '/assets/obj/gameroom/walllamp/moon.obj', mtlPath: '/assets/obj/gameroom/walllamp/moon.mtl', scale: 15, position: { x: -1, y: 3, z: -7.2 }, },//texture 합치기
        // { type: 'obj', objPath: '/assets/obj/gameroom/chips/chips.obj', mtlPath: '/assets/obj/gameroom/chips/chips.mtl', scale: 10, position: { x: 1, y: -5.5, z: 3.4 }, rotation: { y: Math.PI / 2 + 1.77, z: Math.PI + 2.17, } },

        { loader: gltfLoader, path: '/assets/obj/gameroom/fan/fan.gltf', scale: 4, position: { x: 1, y: -5, z: -5.5 }, rotation: { y: -0.97 } },

    ];

    let loadedModels = 0;

    models.forEach(model => {
        if (model.mtlPath && model.objPath) {
            console.log(`Loading MTL file from ${model.mtlPath}`);
            mtlLoader.load(model.mtlPath, (materials) => {
                materials.preload();
                objLoader.setMaterials(materials);
                console.log(`Loading OBJ model from ${model.objPath}`);
                objLoader.load(
                    model.objPath,
                    (object) => {
                        console.log(`OBJ model loaded from ${model.objPath}`);
                        object.traverse((child) => {
                            if (child.isMesh) {
                                checkForNaN(child.geometry);
                            }
                        });
                        object.scale.set(model.scale, model.scale, model.scale);
                        object.position.set(model.position.x, model.position.y, model.position.z);

                        if (model.rotation) {
                            object.rotation.set(
                                model.rotation.x || 0,
                                model.rotation.y || 0,
                                model.rotation.z || 0
                            );
                        }

                        scene.add(object);

                        loadedModels++;
                        if (loadedModels === models.length) {
                            onAllModelsLoaded();
                        }
                    },
                    undefined,
                    (error) => {
                        console.error(`Error loading OBJ model: ${model.objPath}`, error);
                    }
                );
            });
        } else {
            console.log(`Loading model from ${model.path}`);
            model.loader.load(
                model.path,
                (object) => {
                    console.log(`Model loaded from ${model.path}`);
                    object.scene = object.scene || object;
                    object.scene.scale.set(model.scale, model.scale, model.scale);
                    object.scene.position.set(model.position.x, model.position.y, model.position.z);

                    if (model.rotation) {
                        object.scene.rotation.set(
                            model.rotation.x || 0,
                            model.rotation.y || 0,
                            model.rotation.z || 0
                        );
                    }
                    scene.add(object.scene);

                    loadedModels++;
                    if (loadedModels === models.length) {
                        onAllModelsLoaded();
                    }
                },
                undefined,
                (error) => {
                    console.error(`Error loading model: ${model.path}`, error);
                }
            );
        }
    });

    function checkForNaN(geometry) {
        const position = geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
            if (isNaN(position.getX(i)) || isNaN(position.getY(i)) || isNaN(position.getZ(i))) {
                console.error('NaN value found in position attribute');
                return true;
            }
        }
        return false;
    }
}

//     let loadedModels = 0;

//     models.forEach(model => {
//         switch (model.type) {
//             case 'fbx':
//                 loadFBXModel(model);
//                 break;
//             case 'gltf':
//                 loadGLTFModel(model);
//                 break;
//             case 'obj':
//                 loadOBJMTLModel(model);
//                 break;
//             default:
//                 console.error(`Unknown model type: ${model.type}`);
//         }
//     });

//     function loadFBXModel(model) {
//         fbxLoader.load(
//             model.path,
//             (object) => {
//                 console.log(`FBX model loaded from ${model.path}`);

//                 // 텍스처 로드 및 적용
//                 const diffuseTexture = tgaLoader.load(model.textures.diffuse);
//                 const normalTexture = tgaLoader.load(model.textures.normal);
//                 const roughTexture = tgaLoader.load(model.textures.rough);

//                 object.traverse((child) => {
//                     if (child.isMesh) {
//                         checkForNaN(child.geometry);
//                         child.material.map = diffuseTexture;
//                         child.material.normalMap = normalTexture;
//                         child.material.roughnessMap = roughTexture;
//                         child.material.needsUpdate = true;
//                     }
//                 });

//                 object.scale.set(model.scale, model.scale, model.scale);
//                 object.position.set(model.position.x, model.position.y, model.position.z);

//                 if (model.rotation) {
//                     object.rotation.set(
//                         model.rotation.x || 0,
//                         model.rotation.y || 0,
//                         model.rotation.z || 0
//                     );
//                 }
//                 scene.add(object);

//                 loadedModels++;
//                 if (loadedModels === models.length) {
//                     onAllModelsLoaded();
//                 }
//             },
//             undefined,
//             (error) => {
//                 console.error(`Error loading FBX model: ${model.path}`, error);
//             }
//         );
//     }

//     function loadGLTFModel(model) {
//         gltfLoader.load(
//             model.path,
//             (object) => {
//                 console.log(`GLTF model loaded from ${model.path}`);
//                 object.scene = object.scene || object;
//                 object.scene.traverse((child) => {
//                     if (child.isMesh) {
//                         checkForNaN(child.geometry);
//                     }
//                 });
//                 object.scene.scale.set(model.scale, model.scale, model.scale);
//                 object.scene.position.set(model.position.x, model.position.y, model.position.z);

//                 if (model.rotation) {
//                     object.scene.rotation.set(
//                         model.rotation.x || 0,
//                         model.rotation.y || 0,
//                         model.rotation.z || 0
//                     );
//                 }
//                 scene.add(object.scene);

//                 loadedModels++;
//                 if (loadedModels === models.length) {
//                     onAllModelsLoaded();
//                 }
//             },
//             undefined,
//             (error) => {
//                 console.error(`Error loading GLTF model: ${model.path}`, error);
//             }
//         );
//     }

//     function loadOBJMTLModel(model) {
//         console.log(`Loading OBJ model from ${model.objPath}`);
//         objLoader.load(
//             model.objPath,
//             (object) => {
//                 console.log(`OBJ model loaded from ${model.objPath}`);
//                 object.traverse((child) => {
//                     if (child.isMesh) {
//                         checkForNaN(child.geometry);
//                     }
//                 });

//                 // 텍스처 로드 및 적용
//                 console.log(`Loading MTL file from ${model.mtlPath}`);
//                 mtlLoader.load(model.mtlPath, (materials) => {
//                     materials.preload();
//                     object.traverse((child) => {
//                         if (child.isMesh) {
//                             child.material = materials.materials[child.name] || child.material;
//                             child.material.needsUpdate = true;
//                         }
//                     });
//                 });

//                 object.scale.set(model.scale, model.scale, model.scale);
//                 object.position.set(model.position.x, model.position.y, model.position.z);

//                 if (model.rotation) {
//                     object.rotation.set(
//                         model.rotation.x || 0,
//                         model.rotation.y || 0,
//                         model.rotation.z || 0
//                     );
//                 }
//                 scene.add(object);

//                 loadedModels++;
//                 if (loadedModels === models.length) {
//                     onAllModelsLoaded();
//                 }
//             },
//             undefined,
//             (error) => {
//                 console.error(`Error loading OBJ model: ${model.objPath}`, error);
//             }
//         );
//     }

//     function checkForNaN(geometry) {
//         const position = geometry.attributes.position;
//         for (let i = 0; i < position.count; i++) {
//             if (isNaN(position.getX(i)) || isNaN(position.getY(i)) || isNaN(position.getZ(i))) {
//                 console.error('NaN value found in position attribute');
//                 return true;
//             }
//         }
//         return false;
//     }
// }
