import * as THREE from '/three/build/three.module.js';
import DecorObject from '/classes/DecorObject.js';


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
DecorGroup.prototype.getAccessoryAt = function(positionObj){
    let worldPos = new THREE.Vector3();
    let worldPos2 = new THREE.Vector3();
    positionObj.getWorldPosition(worldPos);
    let occupied = false;
    this.decorObjects.forEach(function(item){
        item.getWorldPosition(worldPos2);
        console.log("comparing", worldPos, worldPos2);
        if(worldPos2.distanceTo(worldPos) < 0.01){
            console.log("match found");
            occupied = true;

        }
        /*let occupied = item.getAccessoryAt(positionObj);
        if(occupied != false){
            return occupied;
        }*/
    });
    console.log("Returning...", occupied);
    return occupied;
}
DecorGroup.prototype.removeAccessoryAt = function(positionObj){
    
    this.decorObjects.forEach(function(item, index){
       // if(positionObj.decorObj == item){
            item.removeAccessoryAt(positionObj);
       // }
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

DecorGroup.prototype.changeMaterial = function(key,material, extension){
    this.children.forEach(function(decorObj){
        decorObj.changeMaterial(key,material,extension);
    });
}
DecorGroup.prototype.getMembers = function(){
    return this.decorObjects;
}
DecorGroup.prototype.mirrorGroup = function(){
    console.log("doing for all");
    let i;
    for(i=0;i<this.decorObjects.length;i++){
        this.decorObjects[i].toggleFlip();
       // this.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    }
}
DecorGroup.prototype.drawBoundings = function(prefix, show=true){
    let boxes = [];
    this.decorObjects.forEach(function(item){
        boxes = boxes.concat(item.drawBounding(prefix,show)); 
    });
    return boxes;
}
DecorGroup.prototype.drawOccupieds = function(exclude,snap, show=true){
    let boxes = [];
    //Allow over writes of existing?
   /* this.decorObjects.forEach(function(item){
        boxes = boxes.concat(item.drawOccupied(snap,show)); 
    });*/
    let decObjs = this.decorObjects;
    if(exclude.length > 0){
        let exclusionArray = exclude.split(',');
         exclusionArray.forEach(function(snapid){
            decObjs.forEach(function(item){
                boxes = boxes.concat(item.drawOccupied(snapid,show)); 
            });
             
        });
     }
    
    return boxes;
}

export default DecorGroup;


