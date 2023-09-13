// Imports
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import { createBoxWithRoundedEdges } from './roundbox';

// Rubiks Cube Defaults
const cubeLength = 0.8;
const cubeGap = 0.05;
const cubeDimensions = 3;
const geometry = new THREE.BoxGeometry(cubeLength, cubeLength, cubeLength)

// Get all axes of rotation
export function rotate(axisPos, toRotate) {
    
    if (TWEEN.getAll() != 0) {
        return;
    }
    // Quaternion rotation of cube
    const normalized = axisPos.normalize();
    const q1 = new THREE.Quaternion();
    q1.setFromAxisAngle(normalized, (Math.PI / 2));

    for (let i = 0; i < toRotate.length; i++) {
        // Animate quaternion movement
        // Sourced from: 
        // https://discourse.threejs.org/t/camera-animation-
        // with-quaternion-travels-undesired-path/41147/5
        // Create a rotation Tween

    }

}

// Generate the Rubiks Cube
export function generateCube(scene) {

    let slices = [];
    for (let i = 0; i < cubeDimensions; i++) {
        let slice = [];
        for (let j = 0; j < cubeDimensions; j++) {
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
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

