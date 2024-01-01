// Imports
import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class RubiksCube {

    /**
     * List of all the orbits that a rubiks cube has 
     * (sub-cubes are numbered 0-26 going left to right, 
     * bottom to top going z forward in the xy plane)
     */
    static ROTATIONS = {
        "R1": [0, 1, 2, 3, 4, 5, 6, 7, 8], // Front Face (xy plane)
        "R2": [9, 10, 11, 12, 13, 14, 15, 16, 17], // Middle Slice (xy plane)
        "R3": [18, 19, 20, 21, 22, 23, 24, 25, 26], // Back Face (xy plane)
        "R4": [18, 19, 20, 9, 10, 11, 0, 1, 2], // Front Face (xz plane)
        "R5": [21, 22, 23, 12, 13, 14, 3, 4, 5], // Middle Slice (xz plane)
        "R6": [24, 25, 26, 15, 16, 17, 6, 7, 8], // Back Face (xz plane)
        "R7": [2, 11, 20, 6, 14, 23, 8, 17, 26], // Front Face (yz plane)
        "R8": [1, 10, 19, 4, 13, 22, 7, 16, 25], // Middle Slice (yz plane)
        "R9": [0, 9, 18, 3, 12, 21, 6, 15, 24] // Back Face (yz plane)
    }

    static STABILIZERS = {
        // Will set this up later
    }

    /**
     * Constructor
     */
    RubiksCube () {
        this.cubeMap = undefined 
        this.cube = undefined
        
    }

    /**
     * 
     * @param {String} rotation
     */
    rotate(rotation) {

        // Don't execute if currently rotating
        if (TWEEN.getAll() != 0) {return}
        
        // Quaternion rotation of cube
        const cubesToRotate = RubiksCube.ROTATIONS[rotation]

        // const rotationAxis = this.cubeMap[cubesToRotate[4]].position.clone().normalize()
        const rotationAxis = new THREE.Vector3(1, 0, 0)
        const rotationQ = new THREE.Quaternion()
        rotationQ.setFromAxisAngle(rotationAxis, -1 * Math.PI / 2)

        for (let i = 0; i < cubesToRotate.length; i++) {
            let subCube = this.cubeMap[cubesToRotate[i]]
            let timer = {t:0}

            new TWEEN.Tween(timer)
                .to({t:1}, 1000) 
                .onUpdate((timer) => {
                    subCube.position.applyAxisAngle(rotationAxis, timer)
                    subCube.rotateOnWorldAxis(rotationAxis, timer)
                    console.log(subCube.rotation)
                })
                .easing(TWEEN.Easing.Quadratic.Out)
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

    /**
     * 
     * @param {*} scene 
     */
    async generateRubiksCube(scene) {

        await this.importCube(scene)
        this.cubeMap = {}
        for (let i = 0; i < 27; i++) {
            this.cubeMap[i] = this.cube["children"][i]
            this.cubeMap[i].quaternion.set(0, 0, 0, 0)
        }      
        scene.add(this.cube)
    }
}