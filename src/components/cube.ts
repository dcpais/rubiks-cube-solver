import * as THREE from 'three';
import { createBoxWithRoundedEdges } from './roundbox';

// Rubiks Cube Defaults
const cubeLength = 0.8;
const cubeGap = 0.1;
const cubeDimensions = 3;
const geometry = createBoxWithRoundedEdges(cubeLength, cubeLength, cubeLength, cubeLength / 20, 10)
const material = new THREE.MeshNormalMaterial({color: 0x00ff00});

// Get the center of a cube given its absolute pos
export function getCentrFromAbs(x, y, z) {
    let dx = x - (cubeLength / 2);
    let dy = y - (cubeLength / 2);
    let dz = z - (cubeLength / 2);
    return new THREE.Vector3(x, y, z);
}

// Generate the Rubiks Cube
export function generateCube (scene: THREE.Scene) {

    const slices: THREE.Mesh[] = [];
    for (let i = 0; i < cubeDimensions; i++) {
        const slice: THREE.Mesh = [];
        for (let j = 0; j < cubeDimensions; j++) {
            for (let k = 0; k < cubeDimensions; k++) {
                const newCube = new THREE.Mesh(geometry, material);
                let z = i * (cubeLength + cubeGap) - cubeLength;
                let y = j * (cubeLength + cubeGap) - cubeLength;
                let x = k * (cubeLength + cubeGap) - cubeLength;
                const center = getCentrFromAbs(x, y, z);
                newCube.position.set(
                    x, y, z
                );
                newCube.geometry.center();
                slice.push(newCube);
                scene.add(newCube);
            }
        }
        slices.push(slice);
    }
}

