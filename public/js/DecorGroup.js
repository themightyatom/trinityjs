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
    this.wp1 = new THREE.Vector3();
    this.wp = new THREE.Vector3();

}

// Make MyObject3D have the same methods as Object3D
DecorGroup.prototype = Object.create(THREE.Object3D.prototype);
// Make sure the right constructor gets called
DecorGroup.prototype.constructor = DecorGroup;

DecorGroup.prototype.addModel = function (model,cb,default_material,default_material_key) {
    console.log("sending...", cb);
    var decorObj = new DecorObject();
    this.add(decorObj);
    //if a default material is specified, create or get from cache
    if(default_material.length > 0 && default_material_key.length == 4){
        MaterialManager.assignMaterial(prev,default_material,default_material_key);
    }else{
        if(default_material.length < 1){console.warn("Material parameters are missing")};
        if(default_material_key.length != 4){console.warn("Material key (target) should be 4 characters")};  
    }
    decorObj.loadModel(model,cb);
    this.decorObjects.push(decorObj);
}
DecorGroup.prototype.turnOnSnapPoints = function(snapID){
    var snaps=[];
    this.decorObjects.forEach(function(decorObj){
        snaps = snaps.concat(decorObj.turnOnSnapPoints(snapID));
        decorObj.getAccessories().forEach(function(accSnap){
            snaps = snaps.concat(accSnap.turnOnSnapPoints(snapID));
        });
    });
    return snaps;
}
DecorGroup.prototype.turnOffSnapPoints= function(){
    this.decorObjects.forEach( function(dec){dec.turnOffSnapPoints();}); 
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
    this.decorObjects.push(decorObj);
}
DecorGroup.prototype.removeAccessoryAt = function(positionObj){
    let wp1 = this.wp1;
    let wp2 = this.wp2;
    let targetArray = this.decorObjects;
    this.decorObjects.forEach(function(item, index){
        console.log();

        if(item.getWorldPosition(wp1).equals(positionObj.getWorldPosition(wp2))){
            console.log("Found one");
            item.parent.remove(item);
            targetArray.splice(index, 1);
        }
    })

}
DecorGroup.prototype.removeItem = function(itemToRemove){
    let targetArray = this.decorObjects;
    this.decorObjects.forEach(function(item, index){
        console.log();
        if(item == itemToRemove){
            console.log("Found one");
            item.parent.remove(item);
            targetArray.splice(index, 1);
        }
    })
    return this.decorObjects;
}

DecorGroup.prototype.changeMaterial = function(key,material){
    this.children.forEach(function(decorObj){
        decorObj.changeMaterial(key,material);
    });
}
DecorGroup.prototype.getMembers = function(){
    return this.decorObjects;
}

export default DecorGroup;


