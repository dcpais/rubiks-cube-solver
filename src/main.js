import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { RubiksCube } from './components/rubikscube.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

/**
 * Globals
 */
let scene, camera, renderer, controls;
let composer, outlinePass, renderPass, effectFXAA, outputPass;
let sceneLight, rubiksCube, selectedObjects;
let mouseDownPos, mouseUpPos, hoveredPlane;

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
    window.addEventListener('mouseup', (event) => onMouseUp(event))

    // Start settings
    camera.position.z = 15
    sceneLight = new THREE.AmbientLight(0xffffff)
    scene.add(sceneLight)

}

async function run() {

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

    // Initialize Post Process effects + composer
    composer = new EffectComposer(renderer)
    renderPass = new RenderPass(scene, camera)
    outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        scene, 
        camera
    )
    outputPass = new OutputPass()
    effectFXAA = new ShaderPass(FXAAShader);

    // Set up AntiAliasing effect
    // USEFUL LINK TO FIX EDGE ROUGHNESS
    // https://discourse.threejs.org/t/outlinepass-for-child-meshes/15063/3
    const pixelratio = renderer.getPixelRatio()
    effectFXAA.uniforms['resolution'].value.set(
        1 / window.innerWidth, 
        1 / window.innerHeight
    )
    
    // Outline effect settings
    selectedObjects = []
    outlinePass.renderToScreen = true
    outlinePass.selectedObjects = selectedObjects
    outlinePass.edgeStrength = 2
    outlinePass.edgeGlow = 2
    outlinePass.visibleEdgeColor.set(0xffffff)
    outlinePass.hiddenEdgeColor.set(0xffffff)

    // Post process order
    composer.setSize(window.innerWidth, window.innerHeight)
    composer.addPass(renderPass)
    composer.addPass(outlinePass)
    composer.addPass(outputPass)
    composer.addPass(effectFXAA)
}

function getMousePos(event, raycaster) {
    let pointer = new THREE.Vector2()
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    return pointer
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
function onMouseDown(event) {
    let raycaster = new THREE.Raycaster()
    let pointer = getMousePos(event, raycaster)
    
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(scene.children)

    // If no intersection, we exit
    if (intersects.length > 0) { 
        controls.enabled = false
        mouseDownPos = pointer
        hoveredPlane = intersects[0].normal
    }
}  

function onMouseUp(event) {
    let pointer = getMousePos(event)
    mouseUpPos = pointer
    const dragScreenSpace = mouseDownPos - mouseUpPos
    const dragDirection = new THREE.Vector3(dragScreenSpace.x, dragScreenSpace.y, 1)
    const projection = dragDirection.projectOnPlane(hoveredPlane)
    console.log(projection)

    controls.enabled = true
}

/**
 * Animation Loop
 */
function animate() {
    requestAnimationFrame(animate)
    TWEEN.update()
    renderer.render(scene, camera)
    // composer.render()
    controls.update()
    
}

initScene()
initPostprocessing()
animate()
await run()
