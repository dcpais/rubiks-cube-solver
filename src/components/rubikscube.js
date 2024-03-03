// Imports
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class RubiksCube {

    /**
     * List of all the orbits that a rubiks cube has 
     * (sub-cubes are numbered 0-26 going left to right, 
     * bottom to top going z forward in the xy plane)
     */
    static ROTATION_GROUPS = {
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

    static TRANSLATIONS = {
        
    }

    /**
     * Constructor
     */
    RubiksCube () {
        this.cubeMap = undefined 
        this.cube = undefined
        this.cubeArray = []
        this.cubeView = [
            [[0, 1, 2], [3, 4, 5], [6, 7, 8]], // Front Face (xy plane)
            [[9, 10, 11], [12, 13, 14], [15, 16, 17]], // Middle Face (xy plane)
            [[18, 19, 20], [21, 22, 23], [24, 25, 26]] // Back Face (xy plane)
        ]

    }

    /**
     * 
     * @param {String} rotation
     */
    doRotation(rotationAxis, selectedCube, animationTime) {

        // Don't execute if currently rotating
        if (TWEEN.getAll() != 0) {return}
        
        // Determine rotation group
        

        // Quaternion rotation of cube
        const cubesToRotate = RubiksCube.ROTATION_GROUPS[rotationGroup]

        for (let i = 0; i < cubesToRotate.length; i++) {
            let subCube = this.cubeMap[cubesToRotate[i]]
            let start = { rotation: 0 }
            let prev = { rotation: 0 }
            let end = { rotation: Math.PI / 2 } 

            const tween = new TWEEN.Tween(start)
                .to(end, animationTime)
                .easing(TWEEN.Easing.Quadratic.Out) 
                .onUpdate((obj) => {
                    subCube.position.applyAxisAngle(rotationAxis, obj.rotation - prev.rotation)
                    subCube.rotateOnWorldAxis(rotationAxis, obj.rotation - prev.rotation)
                    prev.rotation = obj.rotation
                })
            
            tween.start()
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
        let materials = {}
        for (let i = 0; i < 27; i++) {
            let currentCube = this.cube["children"][i]

            // For each cube, we must clone from the 7 materials
            // in the rubiks cube to make sure each has its 
            // own unique copy (for making cubes transparent)
            for (let j = 0; j < currentCube.children.length; j++) {
                let mesh = currentCube.children[j]
                if (!(mesh.material.uuid in materials)) {
                    materials[mesh.material.uuid] = mesh.material
                }
                mesh.material = materials[mesh.material.uuid].clone()
            }
            
            // Finally, add the cube to the cubeMap
            let current = this.cube["children"][i]
            current.name = i
            this.cubeMap[i] = this.cube["children"][i]
        }      
        scene.add(this.cube)
        this.cubeArray = Object.values(this.cubeMap)
        console.log(this.cubeArray)
        console.log(this.cubeMap)
    }
}