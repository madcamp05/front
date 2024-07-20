import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// 수정: 모델 로드 함수를 정의합니다.
export function loadModels(scene, onAllModelsLoaded) {
    const gltfLoader = new GLTFLoader();
    const objLoader = new OBJLoader();

    const models = [
        { loader: gltfLoader, path: 'public/assets/gltf/barstool/barstool.gltf', scale: 0.05, position: { x: 0, y: -5, z: 0 } },
        { loader: objLoader, path: 'public/assets/obj/cat/teatable.obj', scale: 0.05, position: { x: 0, y: -5, z: -6.5 }, rotation: { y: Math.PI / 2 } },
        { loader: objLoader, path: 'public/assets/obj/imac/imac.obj', scale: 0.01, position: { x: 0, y: 3, z: 0 }, rotation: { y: Math.PI - 180 } },
        // 다른 모델을 추가하려면 여기 추가
        // { loader: gltfLoader, path: 'public/assets/gltf/other_model.gltf', scale: 0.05, position: { x: 2, y: -5, z: 2 } },
    ];

    let loadedModels = 0;

    models.forEach(model => {
        model.loader.load(
            model.path,
            (object) => {
                object.scene = object.scene || object; // GLTFLoader와 OBJLoader 모두 호환되도록 처리
                object.scene.scale.set(model.scale, model.scale, model.scale);
                object.scene.position.set(model.position.x, model.position.y, model.position.z);

                // 수정: 모델 회전 적용
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
                console.error('An error happened', error);
            }
        );
    });
}
