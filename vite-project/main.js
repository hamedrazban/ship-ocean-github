// import './style.css'


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

let camera, scene, renderer;
let controls, water, sun;
const loader= new GLTFLoader()

function random(min,max){
  return Math.random()*(max-min)+min
}

class movingBoat {
  constructor(folder){
    loader.load(`assets/${folder}/scene.gltf`,(gltf)=>{
    scene.add(gltf.scene)
    gltf.scene.scale.set(10,10,10)
    gltf.scene.position.set(random(-200,200),7,random(-200,200))
    gltf.scene.rotation.set(0,random(0,10),0)
    this.movingboat=gltf.scene
    })
  }
  update(){
    if(this.movingboat){
      this.movingboat.rotation.y += .01
      this.movingboat.translateX(-2)
    }
  }
}
const movingBoat1= new movingBoat('boat2')
const movingBoat2= new movingBoat('boat3')


class Boat {
  constructor(folder,_x,_y,_z,_r){
    loader.load(`assets/${folder}/scene.gltf`,(gltf)=> {
    scene.add(gltf.scene)
    gltf.scene.scale.set(5,5,5)
    gltf.scene.position.set(_x,_y,_z)
    gltf.scene.rotation.set(0,_r,0)
    this.boat=gltf.scene
    this.speed={
      vel:0,
      rot:0
    }
    })
  }
  stop(){
    this.speed.vel=0
    this.speed.rot=0
  }
  update(){
    if(this.boat){
      this.boat.rotation.y += this.speed.rot
      this.boat.translateX(this.speed.vel)
    }
  }
}
const boat1=new Boat('boat1',0,22,20,2)
// const boat2=new Boat('boat2',-50,5,10,1)
// const boat3=new Boat('boat3',50,3,0,1)
init();
animate();

function init() {
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild( renderer.domElement );//document.body

//

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
camera.position.set( 30, 30, 100 );

//

sun = new THREE.Vector3();

// Water

const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

water = new Water(
waterGeometry,
{
textureWidth: 512,
textureHeight: 512,
waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {

texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

} ),
sunDirection: new THREE.Vector3(),
sunColor: 0xffffff,
waterColor: 0x001e0f,
distortionScale: 3.7,
fog: scene.fog !== undefined
}
);

water.rotation.x = - Math.PI / 2;

scene.add( water );

// Skybox

const sky = new Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );

const skyUniforms = sky.material.uniforms;

skyUniforms[ 'turbidity' ].value = 10;
skyUniforms[ 'rayleigh' ].value = 2;
skyUniforms[ 'mieCoefficient' ].value = 0.005;
skyUniforms[ 'mieDirectionalG' ].value = 0.8;

const parameters = {
elevation: 2,
azimuth: 180
};

const pmremGenerator = new THREE.PMREMGenerator( renderer );
let renderTarget;

function updateSun() {

const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
const theta = THREE.MathUtils.degToRad( parameters.azimuth );

sun.setFromSphericalCoords( 1, phi, theta );

sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

if ( renderTarget !== undefined ) renderTarget.dispose();

renderTarget = pmremGenerator.fromScene( sky );

scene.environment = renderTarget.texture;

}

updateSun();

//box geometry delete

//

controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set( 0, 10, 0 );
controls.minDistance = 40.0;
controls.maxDistance = 200.0;
controls.update();

//


// GUI

}

window.addEventListener('keydown',function(e){
  if(e.key=='ArrowUp'){
    boat1.speed.vel=10
  }
})
window.addEventListener('keydown',function(e){
  if(e.key=='ArrowDown'){
    boat1.speed.vel=-10
  }
})
window.addEventListener('keydown',function(e){
  if(e.key=='ArrowRight'){
    boat1.speed.rot=-.1
  }
})
window.addEventListener('keydown',function(e){
  if(e.key=='ArrowLeft'){
    boat1.speed.rot=.1
  }
})
window.addEventListener('keyup',function(e){
    boat1.stop()
  })


function onWindowResize() {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}

function isColliding(obj1,obj2){
  return(math.abs(obj1.position.x-obj2.position.x)<15 &&
  math.abs(obj1.position.z-obj2.position.z)<15
  )
}



function animate() {

requestAnimationFrame( animate );
render();
boat1.update();
movingBoat1.update();
  // if(boat1.boat&&movingBoat1.movingBoat){
// }

movingBoat1.update()
movingBoat2.update()

}

function render() {


water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

renderer.render( scene, camera );
}
