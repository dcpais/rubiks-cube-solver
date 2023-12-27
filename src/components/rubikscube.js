// Imports
import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// Get all axes of rotation
export function rotate(axisPos, toRotate) {

    if (TWEEN.getAll() != 0) {
        return
    }
    
    // Quaternion rotation of cube
    const normalized = axisPos.normalize()
    const q1 = new THREE.Quaternion()
    q1.setFromAxisAngle(normalized, Math.PI / 2)
    for (let i = 0; i < toRotate.length; i++) {
        
        // Animate quaternion movement
        // Sourced from: 
        // https://discourse.threejs.org/t/camera-animation-
        // with-quaternion-travels-undesired-path/41147/5
        let rotatePos = toRotate[i].position
        new TWEEN.Tween(rotatePos)
            .to(rotatePos.clone().applyQuaternion(q1), 1000)
            .onUpdate((object, t) => {
                toRotate[i].quaternion.slerp(q1, 0.1)
                toRotate[i].quaternion.slerp(q1, 0.1)
                toRotate[i].lookAt(toRotate[Math.floor(toRotate.length / 2)].position)
            })
            .start()
    }
}

async function importCube(scene) {

    var gltfLoader = new GLTFLoader()
    let cube;
    await gltfLoader.loadAsync(
        './src/assets/rubiks_cube.gltf', undefined
        
    ).then((gltf) => {cube = gltf.scene; console.log(cube)})
    return cube
}

// Generate the Rubiks Cube
export async function generateRubiksCube(scene) {
    
    // Rubiks Cube Defaults
    const cubeLength = 2
    const cubeGap = 0.05
    const cubeDimensions = 3

    let newCube = await importCube(scene)
    // Generate full Rubiks Cube
    // let cubeMap = {};
    // for (let i = 0; i < cubeDimensions; i++) {
    //     for (let j = 0; j < cubeDimensions; j++) {
    //         for (let k = 0; k < cubeDimensions; k++) {
    //             let newCube = await importCube(scene)
    //             newCube = newCube.children[0]
    //             let z = i * (cubeLength + cubeGap) - cubeLength - cubeGap
    //             let y = j * (cubeLength + cubeGap) - cubeLength - cubeGap
    //             let x = k * (cubeLength + cubeGap) - cubeLength - cubeGap
    //             newCube.position.set(x, y, z)
    //             cubeMap[1] = newCube
    //             scene.add(newCube)
    //         }
    //     }
    // }
    scene.add(newCube)
    let cubeMap
    return cubeMap
}

