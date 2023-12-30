// Imports
import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class RubiksCube {

    constructor () {
        this.cubeMap = undefined
        this.cube = undefined
        
    }

    /**
     * 
     * @param {Vector3} axisPos 
     * @param {Array} toRotate 
     */
    rotate(axisPos, toRotate) {

        if (TWEEN.getAll() != 0) {
            return
        }
        
        // Quaternion rotation of cube
        const normalized = axisPos.normalize()
        const q1 = new THREE.Quaternion()
        q1.setFromAxisAngle(normalized, Math.PI / 2)
        for (let i = 0; i < toRotate.length; i++) {
            
            // Animate quaternion movement
            // Sourced from: 
            // https://discourse.threejs.org/t/camera-animation-
            // with-quaternion-travels-undesired-path/41147/5
            let rotatePos = toRotate[i].position
            new TWEEN.Tween(rotatePos)
                .to(rotatePos.clone().applyQuaternion(q1), 1000)
                .onUpdate((object, t) => {
                    toRotate[i].quaternion.slerp(q1, 0.1)
                    toRotate[i].quaternion.slerp(q1, 0.1)
                    toRotate[i].lookAt(toRotate[Math.floor(toRotate.length / 2)].position)
                })
                .start()
        }
    }

    /**
     * 
     * @param {*} scene 
     * @returns 
     */
    async importCube(scene) {
        let gltfLoader = new GLTFLoader()
        await gltfLoader.loadAsync(
            './src/assets/rubiks_cube.gltf', undefined
        ).then((gltf) => {this.cube = gltf.scene})
    }

    // Generate the Rubiks Cube
    async generateRubiksCube(scene) {

        await this.importCube(scene)
        this.cubeMap = {};
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    let coord = "" + x + y + z
                    this.cubeMap[coord] = this.cube["children"][x + y * 3 + 9 * z] 
                }
            }
        }
        scene.add(this.cube)
    }
}