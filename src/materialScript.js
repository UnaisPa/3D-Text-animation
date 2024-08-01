import * as THREE from "three"
import "./style.css"
import { FontLoader, OrbitControls, TextGeometry, ThreeMFLoader } from "three/examples/jsm/Addons.js";

import imageSource from "../static/color.jpeg"
import matcap from "../static/matcap.jpg"
import matcap2 from "../static/matcap2.jpg"
import outdoor from "../static/outdoor.jpg"
import * as Dat from 'lil-gui'
import typeFaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"

//canvas
const canvas = document.querySelector('canvas.webgl')

//Debug
const gui = new Dat.GUI();



//scene
const scene = new THREE.Scene();
let donuts = []
//sizes
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

//texture
const textureLoader = new THREE.TextureLoader();
// const basicTexture = textureLoader.load(imageSource)
const matCampTexture = textureLoader.load(matcap);

const cubeTexture = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTexture.load([
    outdoor,
    outdoor,
    outdoor,
    outdoor,
    outdoor,
    outdoor
])

//font
const fontLoader = new FontLoader();
let texts = [];
fontLoader.load("fonts/helvetiker_regular.typeface.json",
    (font) => {
        //function runs when the font is successfully loaded
        const textGeometry = new TextGeometry(
            "Hello ",
            {
                font: font,
                size: 0.3,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 2
            },

        )

        const textGeometry2 = new TextGeometry(
            "Designer ",
            {
                font: font,
                size: 0.3,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 2
            },

        )

        const textMaterial = new THREE.MeshMatcapMaterial();
        const text2Material = new THREE.MeshNormalMaterial()
        textMaterial.matcap = matCampTexture
        let text = new THREE.Mesh(textGeometry, textMaterial);
        let text2 = new THREE.Mesh(textGeometry2, text2Material)
        texts.push(text, text2);
        //method to center the text 1
        textGeometry.computeBoundingBox();
        textGeometry.translate(
            - textGeometry.boundingBox.max.x * 2.5,
            - textGeometry.boundingBox.max.y * 0.4,
            - textGeometry.boundingBox.max.z * 0.3
        )

        textGeometry2.computeBoundingBox();
        textGeometry2.translate(
            - textGeometry.boundingBox.max.x * 1.5,
            - textGeometry.boundingBox.max.y * 0.6,
            - textGeometry.boundingBox.max.z * 0.5
        )

        //method to center the text 2
        // textGeometry.center();

        // gui.add(textMaterial, '')
        // gui.add(textMaterial, 'roughness').min(0).max(1).step(0.0001)
        // gui.add(textMaterial, 'metalness').min(0).max(1).step(0.0001)


        scene.add(text, text2);
        console.time('donut')
        let donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        let donutMaterial = new THREE.MeshNormalMaterial();

        let donutGeometry2 = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        let donutMaterial2 = new THREE.MeshMatcapMaterial({ matcap: matCampTexture });
        for (let i = 1; i <= 200; i++) {
            if (i%2==0) {
                let donut = new THREE.Mesh(donutGeometry2, donutMaterial2);
                donuts.push(donut);
                scene.add(donut);

                donut.position.x = (Math.random() - 0.5) * 10
                donut.position.y = (Math.random() - 0.5) * 10
                donut.position.z = (Math.random() - 0.5) * 10

                donut.rotation.x = Math.random() * Math.PI
                donut.rotation.y = Math.random() * Math.PI

                const scale = Math.random()
                donut.scale.set(scale, scale, scale)
            } else {
                let donut2 = new THREE.Mesh(donutGeometry, donutMaterial);


                donuts.push(donut2);
                scene.add(donut2);

                donut2.position.x = (Math.random() - 0.5) * 10
                donut2.position.y = (Math.random() - 0.5) * 10
                donut2.position.z = (Math.random() - 0.5) * 10

                donut2.rotation.x = Math.random() * Math.PI
                donut2.rotation.y = Math.random() * Math.PI
            }


            // console.log(Math.random())
        }
        console.timeEnd('donut') //console the time which takes to complete the looop

    }, undefined,
    (error) => {
        console.error('An error occurred while loading the font:', error);
    }
)

//objects
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture
// material.map = basicTexture
// material.specular = new THREE.Color('red')
//material.map = basicTexture
//  material.color = new THREE.Color('green')
//material.wireframe = true
// material.matcap
material.side = THREE.DoubleSide;

const planeGeopmetry = new THREE.PlaneGeometry(1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32)
const plane = new THREE.Mesh(planeGeopmetry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material)

sphere.position.x = -1.5
torus.position.x = 1.5

// scene.add(plane,sphere,torus);

//adding 
// gui.add(material, 'metalness').min(0).max(1.5).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)

//camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.z = 2
scene.add(camera);

//controlls
const control = new OrbitControls(camera, canvas)
control.enableDamping = true

//lights adding for lambert mesh material
const light = new THREE.AmbientLight(0xffffff, 0.5)

const pointLight = new THREE.PointLight(0xffffff, 19);
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

// scene.add(light, pointLight)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

const clock = new THREE.Clock;

let flag = false
let moveUp = false
const tick = () => {

    const elapsedTime = clock.getElapsedTime();
    // console.log(donut,"donut cominggg")
    donuts.forEach(donut => {
        donut.rotation.x = 0.3 * elapsedTime;
        donut.rotation.y = 0.6 * elapsedTime;
    });
    texts.forEach((text, index) => {
        if (index == 0) {

            console.log(text.position.x)
            console.log(text.position.y)
            console.log(text.position.z)


            if (text.position.x > 1.6 && text.position.x < 1.7) {
                //text.position.y =0;
                //text.position.z=0;
                // window.cancelAnimationFrame()
                flag = true
                moveUp = true
                console.log("kidannilla kidannilaaaa")
                //text.position.y = 0.05 * elapsedTime;
                // text.position.x = 0
                // text.position.y = 0
                // text.position.z = 0


            } else if (!flag) {
                // text.position.x = 1.6
                text.position.x = 0.2 * elapsedTime;

            }
        }
        else {
            if (!flag) {

                text.position.x = - 0.2 * elapsedTime;
            }

           

        }
        // text.rotation.y = 0.01 * elapsedTime;
        // text.rotation.z = 0.01 * elapsedTime;



    })



    //update Objects
    // camera.rotation.y = 0.1 * elapsedTime;
    // donut.rotation.y = 0.1 * elapsedTime;
    // torus.rotation.y = 0.1 * elapsedTime;

    // camera.position.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.12 * elapsedTime;
    // plane.rotation.x = 0.13 * elapsedTime;
    // torus.rotation.x = 0.12 * elapsedTime;


    //should need to update the controls when we added damping for smoother animation
    control.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick);
}

tick();


renderer.setSize(size.width, size.height)
renderer.setPixelRatio(2);
renderer.render(scene, camera)