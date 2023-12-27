import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import * as CUBE from './components/rubikscube.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TetrahedronBufferGeometry } from 'three'

// Initialise the THREE main objects
let scene, camera, renderer, controls

// Initialise App State variables
let cubeSlices, sceneLight, testObjs

// Default Settings
const config = {
    background_color: '#F5F5F5',
    fov: 75,
}


function initScene() {

    // Scene Setup
    scene = new THREE.Scene()
    scene.background = new THREE.Color(config.background_color)

    // Camera Setup
    camera = new THREE.PerspectiveCamera(
        config.fov, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    )

    // Renderer and Canvas setup in page
    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize( window.innerWidth, window.innerHeight )
    }

    // OrbitControls setup
    controls = new OrbitControls(
        camera, renderer.domElement
    )
    controls.minDistance = 15
    controls.maxDistance = 30

    // Key press event handler
    window.addEventListener('keydown', (event) => onKeyPress(event))
    function onKeyPress(event) {
        console.log("The following key was pressed: " + event.key)
        CUBE.rotate(new THREE.Vector3(0, 0, 1), cubeSlices[1])
    }    

    // Start settings
    camera.position.z = 15
    sceneLight = new THREE.AmbientLight(0xffffff)
    scene.add(sceneLight)
}

async function run() {
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
     */

    let cubeMap = await CUBE.generateRubiksCube(scene)
    console.log(cubeMap)

}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    TWEEN.update()
    renderer.render(scene, camera)
}

initScene()
animate()
await run()
