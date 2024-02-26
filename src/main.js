import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { RubiksCube } from './components/rubikscube.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

/**
 * Globals
 */
let scene, camera, renderer, controls;
let composer, outlinePass, renderPass;
let sceneLight, rubiksCube, selectedObjects;

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

    // Event listeners
    window.addEventListener('mousedown', (event) => onMouseDown(event))

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

    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    // const boxgeom = new THREE.BoxGeometry(1, 1, 1)
    
    // const mat = new THREE.MeshPhongMaterial({color: 0x00ff00})
    // const mesh = new THREE.Mesh(boxgeom, mat)
    // mesh.position.x = 5
    // scene.add(mesh)

    rubiksCube = new RubiksCube()
    await rubiksCube.generateRubiksCube(scene)
}

/**
 * 
 */
function initPostprocessing() {

    composer = new EffectComposer(renderer)
    renderPass = new RenderPass(scene, camera)
    outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        scene, 
        camera
    )
    outlinePass.renderToScreen = true
    selectedObjects = []
    outlinePass.selectedObjects = selectedObjects

    composer.addPass(renderPass)
    composer.addPass(outlinePass)

    outlinePass.edgeStrength = 2
    outlinePass.edgeGlow = 2
    outlinePass.visibleEdgeColor.set(0xffffff)
    outlinePass.hiddenEdgeColor.set(0xffffff)

}

/**
 * 
 * @param {*} event 
 * @returns 
 */
function onMouseDown(event) {
    let pointer = new THREE.Vector2()
    let raycaster = new THREE.Raycaster()

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects( scene.children )
    if (intersects.length == 0) { return } // If no intersection

    controls.enabled = false
    let hoveredCube = intersects[0].object
    selectedObjects = []
    selectedObjects.push(hoveredCube)
    outlinePass.selectedObjects = selectedObjects
    console.log(outlinePass.selectedObjects)
    console.log(composer.passes)

    controls.enabled = true
}  

/**
 * Animation Loop
 */
function animate() {
    requestAnimationFrame(animate)
    TWEEN.update()
    renderer.render(scene, camera)
    composer.render()
    controls.update()
    
}

initScene()
initPostprocessing()
animate()
await run()
