import * as THREE from 'three'
import "./style.css"
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import * as Dat from 'lil-gui'
import imageSource from "../static/color.jpeg"

console.log(imageSource)
//Debug
const gui = new Dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Native js for setting texture
// const textureImage = new Image();
// const texture = new THREE.Texture(textureImage)
// textureImage.onload = ()=>{
//     texture.needsUpdate = true
// // }
// textureImage.src = imageSource


//texture setting using textureloader

const loadingManager = new THREE.LoadingManager() //using loading manager to know when everything is loaded, and its very useful
const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load(
    imageSource,
    ()=>{
        //function for on the load
    },
    ()=>{
        //for the progress
    },()=>{
        //for the error
    }
)

//use these function to know when the all loading is completed, loading, on error

// loadingManager.onStart = () =>{
//     console.log('onstart')
// }

// loadingManager.onLoad = () =>{
//     console.log('onload')
// }

// loadingManager.onProgress = () =>{
//     console.log('onprogress')
// }

// loadingManager.onError = () =>{
//     console.log('onerror')
// }
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: texture })


const group = new THREE.Group();

const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
const cube3 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }))

//Align positions of the objects
// cube1.rotation.x = 0.4
cube2.position.x = -2;
cube3.position.x = 2
group.add(cube1, cube2, cube3)

scene.add(cube1)


//GUI ADDING
gui.add(cube1.position, 'x', -3, 3, 0.1).name('Elevation')
gui.add(cube1.rotation, 'x', -3, 3, 0.1)
gui.add(cube1, 'visible')
gui.add(material, 'wireframe')

const params = {
    color: 'red',
    spin: () => {

    }
}
gui.addColor(params, 'color').onChange(() => {
    material.color.set(params.color)
})
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//axesHelper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// const camera = new THREE.OrthographicCamera(-1 *(sizes.width/sizes.height),1,1,-1,0.1,100);

camera.position.z = 3
scene.add(camera)

const curser = {
    x: 0,
    y: 0
}
//TO controll the camera with the mouse move;
window.addEventListener('mousemove', (event) => {
    curser.x = -1 * (event.clientX / sizes.width - 0.5)
    curser.y = event.clientY / sizes.height - 0.5
})

//controlls
const control = new OrbitControls(camera, canvas)
control.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

//FOR RESPONSIVENESS    , REST THE SIZE

window.addEventListener('resize', () => {
    //update sizes;
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera aspect
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix() //we need to call this function when we updated the camera things including aspect ratio;

    //update renderer
    renderer.setSize(sizes.width, sizes.height);
})

//animation

const rotate = () => {

    //Updating objects
    //cube1.rotation.x += 0.1
    //cube1.rotation.y +=0.02

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(rotate);
}


//Double click fullscreen handler
window.addEventListener('dblclick', () => {

    //used webkitFullScreenElemenr and webkitExitFullScreen for safari, without that it won't work
    const fullscreen = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreen) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitFullscreenElement) {
            canvas.webkitRequestFullscreen();
        }

    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else {
            document.webkitExitFullscreen();
        }

    }
})


//rotate();
const clock = new THREE.Clock;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    //  camera.position.x = curser.x *3;
    //  camera.position.y = curser.y *3

    // camera.position.x = Math.sin(curser.x * Math.PI*2) *3
    // camera.position.z = Math.cos(curser.x * Math.PI*2) *3 
    // camera.position.y = curser.y *5


    //camera.lookAt(cube1.position)
    //render

    //should need to update the controls when we added damping for smoother animation
    control.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick);
}

tick();



renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2);
renderer.render(scene, camera)