import * as THREE from 'three';
import { OrbitControls} from 'three/addons/controls/OrbitControls.js'

import * as CUBE from './components/cube.ts'

// Setting up the 3D scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement)

// Canvas settings
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
// Handling canvas resizing
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Main Loop
const cubeSlices = CUBE.generateCube(scene);
function animate() {

    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);

}

animate();