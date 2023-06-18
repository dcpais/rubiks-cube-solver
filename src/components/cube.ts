// Imports
import * as THREE from 'three';
import { createBoxWithRoundedEdges } from './roundbox';
import CUBE_CONFIG from '../config/cube.json';

// Rubiks Cube Defaults
const cubeLength = 0.8;
const cubeGap = 0.1;
const cubeDimensions = 3;
const geometry = new THREE.BoxGeometry(cubeLength, cubeLength, cubeLength)


// Generate the Rubiks Cube
export function generateCube (scene: THREE.Scene) {

    const slices: THREE.Mesh[] = [];
    for (let i = 0; i < cubeDimensions; i++) {
        const slice: THREE.Mesh = [];
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
}

