import * as THREE from '/three/build/three.module.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
import DecorObject from '/js/DecorObject.js';


var DecorGroup = function () {

    THREE.Object3D.call(this);
    this.type = 'DecorGroup';
    this.targets = [];
    this.snapPoints = [];
    this.accessories = [];
    this.decorObjects = [];

}

// Make MyObject3D have the same methods as Object3D
DecorGroup.prototype = Object.create(THREE.Object3D.prototype);
// Make sure the right constructor gets called
DecorGroup.prototype.constructor = DecorGroup;

DecorGroup.prototype.addModel = function (model,cb,matrix) {
    console.log("sending...", cb);
    var decorObj = new DecorObject();
    this.add(decorObj);
    decorObj.loadModel(model,cb,matrix);
    this.decorObjects.push(decorObj);
}
DecorGroup.prototype.turnOnSnapPoints = function(snapID){
    var snaps=[];
    this.decorObjects.forEach(function(decorObj){
        snaps = snaps.concat(decorObj.turnOnSnapPoints(snapID));
    });
    return snaps;
}
DecorGroup.prototype.turnOffSnapPoints= function(){
    this.snapPoints.forEach( function(sp){sp.visible = false;}); 
}
DecorGroup.prototype.loadAccesory = function(model,target) {
        console.log("loading", model, target);
        let decor = new DecorObject();
        decor.position.copy(target.position);
        decor.quaternion.copy(target.quaternion);
        this.add(decor);
        decor.loadModel(model);
        this.decorObjects.push(decor);
}
DecorGroup.prototype.addMember = function(decorObj){
    this.add(decorObj);
    this.decorObjects.push(decorObj);
}

DecorGroup.prototype.changeMaterial = function(key,material){
    this.children.forEach(function(decorObj){
        decorObj.changeMaterial(key,material);
    });
}

export default DecorGroup;


