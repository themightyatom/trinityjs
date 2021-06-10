
import * as THREE from '/three/build/three.module.js';
// import { RoomEnvironment } from '/three/examples/jsm/environments/RoomEnvironment.js';
import { RGBELoader } from '/three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';

//import DecorManager from '/js/DecorManager.js';

//import DecorUI from '/js/DecorUI.js';


import { GUI } from '/three/examples/jsm/libs/dat.gui.module.js';
import SquareRoom from '/classes/SquareRoom.js';





let camera, scene, renderer, preview, controls, width3d, height3d, sunLight;
let targetMat, decorLayer, envLayer, loadAni, container;



init('ltvs_container');
render();
animate();

function init(cont) {

    container = document.getElementById(cont);

    width3d = container.offsetWidth;
    height3d = container.offsetHeight;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width3d, height3d);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.shadowMap.type = THREE.BasicShadowMap;

    renderer.gammaFactor = 2.2;

    camera = new THREE.PerspectiveCamera(45, width3d / height3d, 0.1, 25);
    camera.position.set(0, 1, 10);

    // const environment = new RoomEnvironment();
    // const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);

    // scene.fog = new THREE.Fog(0xf8f8f8, 3, 8);

    scene.add(camera);

    decorLayer = new THREE.Object3D();
    scene.add(decorLayer);

    envLayer = new THREE.Object3D();
    scene.add(envLayer);
    //scene.environment = pmremGenerator.fromScene(environment).texture;

    /* const grid = new THREE.GridHelper(20, 20, 0xffffff, 0xffffff);
     grid.material.opacity = 0.5;
     grid.material.depthWrite = false;
     grid.material.transparent = true;
     scene.add(grid);*/
    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('/env/')
        .load('material1k.hdr', function (texture) {

            const envMap = pmremGenerator.fromEquirectangular(texture).texture;

            //scene.background = envMap;
            scene.environment = envMap;

            texture.dispose();
            pmremGenerator.dispose();
        });


    preview = new THREE.Object3D();
    scene.add(preview);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = .1;
    controls.maxDistance = 10;
    controls.target.set(0, 1, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    /* DecorManager.setCamera(camera);
     DecorManager.setTargetLayer(decorLayer);
     DecorManager.setEnvLayer(envLayer);
     DecorManager.setTargetWindow(container);
     DecorManager.setControls(controls);*/

    //Lighting
    sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);
    // scene.add(sunLight);
    sunLight.name = "directionalLight1";
    sunLight.position.x = 1;
    sunLight.position.y = 2;
    sunLight.position.z = 5;

    let sunsize = 2;
    let lightDistance = 10;

    sunLight.castShadow = true;
    let directionalHelper = new THREE.DirectionalLightHelper(sunLight);
    //scene.add(directionalHelper);
    scene.add(sunLight.target);
    var lightTarget = new THREE.Object3D();
    var mapsize = 256;
    scene.add(lightTarget);
    sunLight.target = lightTarget;
    //Set up shadow properties for the light
    sunLight.shadow.mapSize.width = mapsize;  // default
    sunLight.shadow.mapSize.height = mapsize; // default
    sunLight.shadow.camera.near = 0.0;    // default
    sunLight.shadow.camera.far = 10;     // default
    sunLight.shadow.camera.left = -sunsize;
    sunLight.shadow.camera.right = sunsize;
    sunLight.shadow.camera.top = sunsize;
    sunLight.shadow.camera.bottom = -sunsize;
    sunLight.shadow.bias = 0.0001;
    sunLight.shadow.radius = 2;

    /*var ambient = new THREE.AmbientLight(0xFFFFFF, 1);
    ambient.name = "ambient";
    scene.add(ambient);*/
    const size = 0.02;
    const widthSegments = 2;
    const heightSegments = 2;
    const depthSegments = 2;
    const boxGeometry = new THREE.BoxGeometry(
        size, size, size,
        widthSegments, heightSegments, depthSegments);
    const geometry = new THREE.EdgesGeometry(boxGeometry);

    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    loadAni = new THREE.LineSegments(geometry, material);
    let tilter = new THREE.Object3D();
    tilter.position.z = -1;
    tilter.rotateX(-0.7);
    tilter.add(loadAni);
    camera.add(tilter);


    // Init gui
    /*	const gui = new GUI();
       
        gui.add( renderer, 'toneMappingExposure', 0, 5); 
        gui.add( sunLight, 'intensity', 0, 5); 
        gui.add( sunLight.position, 'x', -5, 5); 
        gui.add( sunLight.position, 'y', -5, 5); 
        gui.add(sunLight.shadow, 'bias', -0.1,0.1);
        gui.add(sunLight.shadow, 'radius', 0,100); */



    onWindowResize();

}
function hideSpinner() {
    loadAni.visible = false;

}

function onWindowResize() {
    width3d = container.offsetWidth;
    height3d = container.offsetHeight;
    //DecorManager.setWindowSize(width3d, height3d);
    camera.aspect = width3d / height3d;
    camera.updateProjectionMatrix();
    renderer.setSize(width3d, height3d);

    render();

}
function animate() {
    requestAnimationFrame(animate);
    loadAni.rotateY(0.02);
    render();
}

function hideAllSnaps() {
    for (var i = 0; i < snapPoints.length; i++) {
        snapPoints[i].visible = false;
    }
}


/*function adjustCamera(target) {
    let boundingBox = new THREE.Box3().setFromObject(target);
    let size = new THREE.Vector3();
    boundingBox.getSize(size) // Returns Vector3
    controls.target.set(target.position.x, size.y / 2, target.position.z);
    camera.position.y = size.y / 2;
    camera.position.x = target.position.x;
    camera.position.z = Math.max(size.x, size.y) * 2;
    camera.updateProjectionMatrix();
    render();
    camera.updateProjectionMatrix();
    render();
}*/
function render() {
    renderer.render(scene, camera);
}
function setCamPos(cam) {
    camera.position.copy(cam.position);
    camera.quaternion.copy(cam.quaternion);
    render();
}
function grabScreenshot() {
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL();
}



function applyMaterialProperty(property, value) {

    switch (property) {
        case "diffuse_map":
            var loader = new THREE.TextureLoader();
            function onLoad(texture) {
                targetMat.map = texture;
                texture.flipY = false;
                targetMat.needsUpdate = true;
                targetMat.map.wrapS = THREE.RepeatWrapping;
                targetMat.map.wrapT = THREE.RepeatWrapping;
                render();
            }
            if (value == null) {
                targetMat.map = null;
                targetMat.needsUpdate = true;
                render();
            } else {
                loader.load("/textures/" + value, onLoad);
            }
            break;
        case "normal_map":
            var loader = new THREE.TextureLoader();
            function onnormLoad(texture) {
                targetMat.normalMap = texture;
                texture.flipY = false;
                targetMat.normalMap.wrapS = THREE.RepeatWrapping;
                targetMat.normalMap.wrapT = THREE.RepeatWrapping;
                targetMat.needsUpdate = true;
                render();
            }
            if (value == null) {
                targetMat.normalMap = null;
                targetMat.needsUpdate = true;
                render();
            } else {
                loader.load("/textures/" + value, onnormLoad);
            }

            break;
        case "normal_value":
            targetMat.normalScale = new THREE.Vector2(value, value);
            render();
            break;
        case "bump_map":
            var loader = new THREE.TextureLoader();
            function onbumpLoad(texture) {
                targetMat.bumpMap = texture;
                texture.flipY = false;
                targetMat.bumpMap.wrapS = THREE.RepeatWrapping;
                targetMat.bumpMap.wrapT = THREE.RepeatWrapping;
                targetMat.needsUpdate = true;
                render();
            }
            if (value == null) {
                targetMat.bumpMap = null;
                targetMat.needsUpdate = true;
                render();
            } else {
                loader.load("/textures/" + value, onbumpLoad);
            }
            break;
        case "bump_value":
            targetMat.bumpScale = value;
            render();
            break;
        case "color_hex":
            var hx = value.substr(1);
            targetMat.color.setHex('0x' + hx);
            render();
            break;
        case "emissive_hex":
            var hx = value.substr(1);
            targetMat.emissive.setHex('0x' + hx);
            render();
            break;
        case "opacity_value":
            targetMat.opacity = value;
            if (value == 1) {
                targetMat.transparent = false;
            } else {
                targetMat.transparent = true;
            }
            render();
            break;
        case "roughness_value":
            targetMat.roughness = value;
            render();
            break;
        case "metalness_value":
            targetMat.metalness = value;
            render();
            break;
        case "bump_map":
            var loader = new THREE.TextureLoader();
            function onmapLoad(texture) {
                targetMat.bumpMap = texture;
                texture.flipY = false;
                targetMat.needsUpdate = true;
                render();
            }
            loader.load("/textures/" + value, onmapLoad);
            break;
        case "bump_value":
            targetMat.bumpScale = value;
            render();
            break;

        default:
            break;
    }
}

function getModelFromID(id) {
    console.log("getting", id);
    fetch('/clients/' + id)
        .then(response => response.json())
        .then(data => {
            console.log("model loaded____________" + data.params.id)
            DecorManager.addGroup(data.params.id, data.params.model, data.params.default_material, data.params.default_material_key, data.params.sku, data.defaultAccessories)
            // loadGroup('{{params.model}}', '{{params.default_material}}', '{{params.default_material_key}}', '{{params.sku}}', defaultAccs);

            DecorUI.createUI(data.materials, data.accessories, data.params.default_material_key)

        })
}
function loadEnv() {
    //0DecorParametricSpace.loadEnvironment('room.glb');
    let SR = new SquareRoom();
    SR.loadModel(null, 'room.glb', '', function () {
        console.log("CALLED BACK");
        hideSpinner();
    });
    envLayer.add(SR);
    document.addEventListener('keydown', logKey);
    function logKey(e) {
        console.log(` ${e.code}`);
        if (e.code == "KeyW") SR.increaseHeight();
        if (e.code == "KeyA") SR.increaseWidth();
        if (e.code == "KeyD") SR.increaseDepth();
        if (e.code == "KeyB") SR.addHole();
        if (e.code == "KeyT") SR.changeTexture();
    }
}


window.scene = scene;
window.render = render;
window.envLayer = envLayer;
window.loadEnv = loadEnv;
window.dev__hidespinner = hideSpinner;




