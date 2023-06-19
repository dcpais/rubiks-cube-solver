// Imports
import * as THREE from 'three';
import { createBoxWithRoundedEdges } from './roundbox';

// Rubiks Cube Defaults
const cubeLength = 0.8;
const cubeGap = 0.05;
const cubeDimensions = 3;
const geometry = new THREE.BoxGeometry(cubeLength, cubeLength, cubeLength)

// Get all axes of rotation
export function rotate(axisPos, toRotate) {
    
    const normalized = axisPos.normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(normalized, Math.PI / 2);

    for (let cube of toRotate) {
        let rotatePos = cube.position;
        rotatePos.applyQuaternion(quaternion);
    }

}

// Generate the Rubiks Cube
export function generateCube(scene) {

    let slices = [];
    for (let i = 0; i < cubeDimensions; i++) {
        let slice = [];
        for (let j = 0; j < cubeDimensions; j++) {
            const material = new THREE.MeshToonMaterial({color: 0x00ff00});
            for (let k = 0; k < cubeDimensions; k++) {
                const newCube = new THREE.Mesh(geometry, material);
                let z = i * (cubeLength + cubeGap) - cubeLength - cubeGap;
                let y = j * (cubeLength + cubeGap) - cubeLength - cubeGap;
                let x = k * (cubeLength + cubeGap) - cubeLength - cubeGap;
                newCube.position.set(x, y, z);
                newCube.material.color = new THREE.Color("#" + Math.floor(Math.random()*16777215).toString(16))
                slice.push(newCube);
                scene.add(newCube);
            }
        }
        slices.push(slice);
    }

    return slices;
}

