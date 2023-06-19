import * as THREE from 'three';
import * as CUBE from './components/cube.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Initialise the THREE main objects
let scene, camera, renderer, controls;

// Initialise App State variables
let cubeSlices, sceneLight;

// Default Settings
const config = {
    background_color: '#FFFFFF',
    fov: 75,
}

init();
animate();

function init() {

    // Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.background_color);

    // Camera Setup
    camera = new THREE.PerspectiveCamera(
        config.fov, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );

    // Renderer and Canvas setup in page
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    // OrbitControls setup
    controls = new OrbitControls(
        camera, renderer.domElement
    );
    controls.minDistance = 4;
    controls.maxDistance = 20;

    // Key press event handler
    window.addEventListener('keydown', (event) => onKeyPress(event));
    function onKeyPress(event) {
        console.log("The following key was pressed: " + event.key);
        CUBE.rotate(new THREE.Vector3(0, 0, 1), cubeSlices[0]);
    }

    // Mouse click event handler
    

    // Start settings
    camera.position.z = 5;
    cubeSlices = CUBE.generateCube(scene);
    sceneLight = new THREE.PointLight(0xffffff, 1, 100);
    sceneLight.position.set(0, 0, 5); 
    scene.add(sceneLight);
}

function animate() {

    requestAnimationFrame(animate);

    renderer.render(scene, camera);

}

animate();