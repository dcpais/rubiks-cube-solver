// Imports
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import { createBoxWithRoundedEdges } from './roundbox';

// Rubiks Cube Defaults
const cubeLength = 0.8;
const cubeGap = 0.05;
const cubeDimensions = 3;
const geometry = new THREE.BoxGeometry(cubeLength, cubeLength, cubeLength)
// Define the colors for each face of the cube
const colors = [
    0xff0000, // Red
    0x00ff00, // Green
    0x0000ff, // Blue
    0xffff00, // Yellow
    0xff00ff, // Magenta
    0x00ffff, // Cyan
];

// Create an array of materials for each face
const materials = colors.map(color => new THREE.MeshStandardMaterial({ color }));

// Get all axes of rotation
export function rotate(axisPos, toRotate) {

    if (TWEEN.getAll() != 0) {
        return;
    }
    
    // Quaternion rotation of cube
    const normalized = axisPos.normalize();
    const q1 = new THREE.Quaternion();
    q1.setFromAxisAngle(normalized, Math.PI / 2);
    for (let i = 0; i < toRotate.length; i++) {
        
        // Animate quaternion movement
        // Sourced from: 
        // https://discourse.threejs.org/t/camera-animation-
        // with-quaternion-travels-undesired-path/41147/5
        let rotatePos = toRotate[i].position;
        new TWEEN.Tween(rotatePos)
            .to(rotatePos.clone().applyQuaternion(q1), 1000)
            .to(rotatePos.clone().applyQuaternion(q1), 200)
            .onUpdate((object, t) => {
                toRotate[i].quaternion.slerp(q1, 0.1)
                toRotate[i].quaternion.slerp(q1, 0.1);
                toRotate[i].lookAt(normalized);
            })
            .start()
    }
}

// Generate the Rubiks Cube
export function generateCube(scene) {

    let slices = [];
    for (let i = 0; i < cubeDimensions; i++) {
        let slice = [];
        for (let j = 0; j < cubeDimensions; j++) {
            for (let k = 0; k < cubeDimensions; k++) {
                const newCube = new THREE.Mesh(geometry, materials);
                let z = i * (cubeLength + cubeGap) - cubeLength - cubeGap;
                let y = j * (cubeLength + cubeGap) - cubeLength - cubeGap;
                let x = k * (cubeLength + cubeGap) - cubeLength - cubeGap;
                newCube.position.set(x, y, z);
                slice.push(newCube);
                scene.add(newCube);
            }
        }
        slices.push(slice);
    }

    return slices;
}

