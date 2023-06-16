import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const cubeSize = 0.5;
const cubeGap = 0.1;
const cubesPerDimension = 3;
const geometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var cubes = [];
for (let i = 0; i < cubesPerDimension; i++) {
    for (let j = 0; j < cubesPerDimension; j++) {
        for (let k = 0; k < cubesPerDimension; k++) {
            const newCube = new THREE.Mesh(geometry, material);
            let z = i * (cubeSize + cubeGap) - (2*cubeSize) + (2*cubeGap);
            let y = j * (cubeSize + cubeGap) - (2*cubeSize) + (2*cubeGap);
            let x = k * (cubeSize + cubeGap) - (2*cubeSize) + (2*cubeGap);
            newCube.position.set(x, y, z);
            cubes.push(newCube);
            scene.add(newCube);
        }
    }
}

camera.position.z = 10;
function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

}

console.log("hello");
animate();