import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import * as CUBE from './components/cube.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TetrahedronBufferGeometry } from 'three';

// Initialise the THREE main objects
let scene, camera, renderer, controls;

// Initialise App State variables
let cubeSlices, sceneLight, testObjs;

// Default Settings
const config = {
    background_color: '#F5F5F5',
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
        CUBE.rotate(new THREE.Vector3(0, 0, 1), [cube]);
    }

    // Mouse click event handler
    

    // Start settings
    camera.position.z = 5;
    //cubeSlices = CUBE.generateCube(scene);
    sceneLight = new THREE.AmbientLight(0xffffff);
    scene.add(sceneLight);

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

    // Create a cube geometry
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Create a mesh for the cube using the cube geometry and materials
    const cube = new THREE.Mesh(cubeGeometry, materials);

    // Add the cube to the scene
    scene.add(cube);



    // const axes = new THREE.AxesHelper(5);
    // scene.add(axes);

    // const cMat = new THREE.MeshToonMaterial({color: "#FF0000"})
    // const cGeom = new THREE.BoxGeometry(1, 1, 1);
    // const cube = new THREE.Mesh(cGeom, cMat);
    // scene.add(cube);

    // // Cube defaults
    // cube.position.set(1, 1, 0);
    
    // new TWEEN.Tween()

}

function animate() {

    requestAnimationFrame(animate);
    
    TWEEN.update();

    renderer.render(scene, camera);

}

animate();