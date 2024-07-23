import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { TextureLoader } from 'three';

export function loadModelsKitchen(scene, onAllModelsLoaded) {
    const gltfLoader = new GLTFLoader();
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const textureLoader = new TextureLoader();

    const models = [
        { name: 'sink', loader: objLoader, path: '/assets/obj/kitchen/sink/sink.obj', mtlPath: '/assets/obj/kitchen/sink/sink.mtl', scale: 4.5, position: { x: -7, y: -5, z: 0 },  rotation: { x: 0, y: 1.57, z: 0 }},
        //{ loader: objLoader, path: '/assets/obj/kitchen/wine/wine.obj', mtlPath: '/assets/obj/kitchen/wine/wine.mtl', scale: 0.1, position: { x: -0.5, y: -1, z: -6.5 }, rotation: { x: 1.57, y: -3.14, z: 0 } },
        { loader: objLoader, objPath: '/assets/obj/kitchen/fridge/fridge.obj', mtlPath: '/assets/obj/kitchen/fridge/fridge.mtl', scale: 0.5, position: { x: -5.8, y: -5, z: 5.2 }, rotation: { x: Math.PI / 2 - 3.14, z: Math.PI / 2 }},
        { loader: objLoader, objPath: '/assets/obj/kitchen/diningtable/diningtable.obj', mtlPath: '/assets/obj/kitchen/diningtable/diningtable.mtl', scale: 0.1, position: { x: 4, y: -5, z: 1 }, rotation: { x: 0, y: 1.57, z: 0 }},
        { loader: objLoader, objPath: '/assets/obj/kitchen/oven/oven.obj', mtlPath: '/assets/obj/kitchen/oven/oven.mtl', scale: 5.8, position: { x: -7.2, y: -6, z: -3 }, rotation: { x: 0, y: 1.57, z: 0 } },
        { loader: objLoader, objPath: '/assets/obj/kitchen/kitchenclock/kitchenclock.obj', mtlPath: '/assets/obj/kitchen/kitchenclock/kitchenclock.mtl', scale: 0.1, position: { x: 1, y: 5, z: -7 }, rotation: { x: 0, y: Math.PI + 1.57, z: 1.57 }},
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
                        object.name = model.name || '';

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
                    object.scene.name = model.name || '';

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