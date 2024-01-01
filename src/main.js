import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import { RubiksCube } from './components/rubikscube.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * 
 */
let scene, camera, renderer, controls, sceneLight, rubiksCube

/**
 * Set up the requirements for a THREE js scene
 */
function initScene() {

    // Scene Setup
    scene = new THREE.Scene()
    scene.background = new THREE.Color("#F5F5F5") // Background colour

    // Camera Setup
    camera = new THREE.PerspectiveCamera(
        75, // FOV 
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Close clip distance
        1000 // Far clip distance
    )

    // Renderer and Canvas setup in page
    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // OrbitControls setup
    controls = new OrbitControls(
        camera, renderer.domElement
    )
    controls.minDistance = 5
    controls.maxDistance = 30
    controls.enableDamping = true
    controls.dampingFactor = 0.025

    // Key press event handler
    window.addEventListener('keydown', (event) => onKeyPress(event))
    function onKeyPress(event) {
        console.log("The following key was pressed: " + event.key)
        rubiksCube.rotate("R1")
    }    

    // Start settings
    camera.position.z = 15
    sceneLight = new THREE.AmbientLight(0xffffff)
    scene.add(sceneLight)

    // let geom = new THREE.BoxGeometry(1, 1, 1, 1)
    
    // let mat = new THREE.MeshPhongMaterial()
    // let box = new THREE.Mesh(geom, mat)
    // box.position.set(5, 0, 0)
    // scene.add(box)
    // let rotaxis = new THREE.Vector3(0, 0, 1)
    // let tUpdate = (angle) => {
    //     console.log("reached")
    //     box.position.applyAxisAngle(rotaxis, Math.PI / 100)
    //     let quat = new THREE.Quaternion()
    //     quat.setFromAxisAngle(rotaxis, angle)
    //     box.rotation.setFromQuaternion(quat)
    //     setTimeout(() => {tUpdate(angle + Math.PI /100)}, 20)
    // }
    // setTimeout(tUpdate(Math.PI / 100), 1000)
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
    rubiksCube = new RubiksCube()
    await rubiksCube.generateRubiksCube(scene)
    console.log(rubiksCube.cubeMap)
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    TWEEN.update()
    renderer.render(scene, camera)
    controls.update()
}

initScene()
animate()
await run()
