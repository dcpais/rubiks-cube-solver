import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import * as CUBE from './components/rubikscube.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TetrahedronBufferGeometry } from 'three';
import { createBoxWithRoundedEdges } from './components/roundbox.js';

// Initialise the THREE main objects
let scene, camera, renderer, controls;

// Initialise App State variables
let cubeSlices, sceneLight, testObjs;

// Default Settings
const config = {
    background_color: '#F5F5F5',
    fov: 75,
}

initScene();
animate();
run();

function initScene() {

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

    // Start settings
    camera.position.z = 5;
    sceneLight = new THREE.AmbientLight(0xffffff);
    scene.add(sceneLight);
}

function run() {
    /**
     * TESTING AREA!!!!
     * 
     * Working on getting the cube rotation and
     * face colours implemented correctly
     * before applying to all the cubes. 
     * 
     * Will also plan out how the rotation axes 
     * will be laid out, as well as the cubes of each
     * face.
     * 
     * PLAN: 
     * - Design a cube as 1 white cube with seperate
     *      objects representing the faces? will be 
     * - easier to keep track of for actual game logic?
     *
     */


    
    // Generate our Rubik's cube
    cubeSlices = CUBE.generateCube(scene);
    
    // const cubeGeometry = new createBoxWithRoundedEdges(1, 1, 1, 0.04, 1);
    // const cube = new THREE.Mesh(cubeGeometry, materials);
    // scene.add(cube);

    const axes = new THREE.AxesHelper(5);
    scene.add(axes);


}

/**
 * Set up animations for TWEEN
 */
function animate() {
    
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}

animate();