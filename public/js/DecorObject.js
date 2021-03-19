import * as THREE from '/three/build/three.module.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
import SnapMaterial from '/js/SnapMaterial.js';


var DecorObject = function () {

    THREE.Object3D.call(this);
    this.type = 'DecorObject';
    this.targets = [];
    this.snapPoints = [];
    this.accessories = [];
    this.accessoryLayer = new THREE.Object3D();
    this.accessoryLayer.name = "accessories";
    this.add(this.accessoryLayer);
    this.scene;

}

// Make MyObject3D have the same methods as Object3D
DecorObject.prototype = Object.create(THREE.Object3D.prototype);
// Make sure the right constructor gets called
DecorObject.prototype.constructor = DecorObject;

DecorObject.prototype.loadModel = function (model,cb) {
    const loadmanager = new THREE.LoadingManager();
    // make sure new objects are rendered after load
    loadmanager.onLoad = function () {
        render();
    };
    const loader = new GLTFLoader(loadmanager).setPath('/glb/');
    loader.load(model, (gltf) => {
        
        this.add(gltf.scene);
        this.scene = gltf.scene;
        this.analyzeModel(gltf);
        if (cb) {
            cb();
        }
    })
}
DecorObject.prototype.turnOnSnapPoints = function(snapID){
    this.turnOffSnapPoints();
    let snaps = [];
    this.snapPoints.forEach( function(sp){
        if(sp.snap == snapID){
            sp.visible = true;
            snaps.push(sp);
        } 
    });
    // add any snap points from accessories
    this.accessories.forEach( function(acc){
        var accSnaps = acc.turnOnSnapPoints();
        snaps = snaps.concat(accSnaps);
    });
    return snaps;
}
DecorObject.prototype.turnOffSnapPoints= function(){
    this.snapPoints.forEach( function(sp){sp.visible = false;}); 
    console.log("got turnoff");
}

DecorObject.prototype.analyzeModel = function(gltf) {
    //  snapPoints = [];
    this.targets = [];
    var container = this;

    gltf.scene.traverse(function (child) {
        if (child.name.substr(0, 3) == "_as" && !child.isMesh) {
            this.snapPoints.push(child.name)
        } else {

        };
        if (child.isMesh) {
            if (child.material.opacity != 1) child.material.transparent = true;
            switch (child.name.substr(0, 3)) {
                case 'woo':
                    // child.material = SharedMaterials.getMaterialFromID('lightWood');
                    //targetMat = child.material;
                    //  child.material.map.wrapS = THREE.RepeatWrapping;
                    //  child.material.map.wrapT = THREE.RepeatWrapping;
                    //child.material.roughness = 0;
                    //child.material.metalness = 1;
                    break;
                case 'glas':
                    // child.material = SharedMaterials.getMaterialFromID('glass');
                    break;
                case 'prev':
                    targetMat = child.material;
                    //  child.material.map.wrapS = THREE.RepeatWrapping;
                    //  child.material.map.wrapT = THREE.RepeatWrapping;
                    break;
                // Make snap points invisible
                case '_as':
                  //  child.visible = false;
                    container.snapPoints.push(child);
                    var snap = child.name.substring(3, child.name.lastIndexOf('_'));
                    child.snap = snap;
                    child.accessoryLayer = container.accessoryLayer;
                    //create holder for any applied objects
                   /* const geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
                    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
                    var snapHolder = new THREE.Mesh(geometry, material);
                    child.parent.add(snapHolder);
                    snapHolder.position.copy(child.position);
                    snapHolder.quaternion.copy(child.quaternion);
                    child.holder = snapHolder;
                    child.hoste = container;*/
                    child.visible = false;
                    child.material = SnapMaterial;

                default:
                    break;

            }
        }
    });
}

DecorObject.prototype.loadAccesory = function(model,target) {
        console.log("loading", model, target);
        let decor = new DecorObject();
        decor.position.copy(target.position);
        decor.quaternion.copy(target.quaternion);
        this.add(decor);
        decor.loadModel(model);
        this.accessories.push(decor);
}
DecorObject.prototype.changeMaterial = function(key,material) {
       console.log(material);
        this.scene.traverse(function (child) {
            if(child.name.substr(0,4) == key){
                child.material = material;
            }
        });
        render();
}

export default DecorObject;


