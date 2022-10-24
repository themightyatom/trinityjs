import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class DecorAnimated extends DecorObject {
    constructor() {
        super();
        this.metadata = '';
        this.classtype = "DecorAnimatedCamera";
        this.YAXIS = new THREE.Vector3(1, 0, 0);
        this.bounding;
        this.cHeight = 0.09;
        this.mixer;
        this.timescale = 100;
        this.totalDuration = 0;
        this.animationArray = [];
        this.camera;
        this.camera1_Orientation;
        this.properties = [
            { title: 'animate', ui: 'slider', range: [0, 100], value: this.defaultopen },
            { title: 'remove', ui: 'alert_button' }
        ]
    }
    loadModel(id, model, sku, cb) {
        let host = this
        super.loadModel(id, model, sku, function () {
            host.registerProperties();
            host.loadedcallback();
            cb();

        });

    }
    registerProperties() {
        this.signature.properties = this.properties;
    }
    loadedcallback() {
        
        // this.getVerts();
        let scope = this;
        this.mixer = new THREE.AnimationMixer(this.scene);

        this.gltf.animations.forEach((clip) => {

            scope.mixer.clipAction(clip).play();
            scope.animationArray.push(clip);
            clip.clampWhenFinished = true;
            clip.loop = THREE.LoopOnce;
            if (clip.duration > scope.totalDuration) {
                scope.totalDuration = clip.duration;
            }

        });


       // this.setProperty("angle", this.defaultangle);

    }

    setProperty(prop, value) {
        
        switch (prop) {
            case "animate":
                let timeValue = Math.max((value / this.timescale * this.totalDuration) - 0.0001, 0);
              
                this.mixer.setTime(timeValue);
                console.log(this.camera);
                DD2022.decor3d.camera.position.copy(this.camera.position);
                //DD2022.decor3d.camera.applyQuaternion (this.camera.quaternion);
                //DD2022.decor3d.camera.applyMatrix4(this.camera.matrix);
                
                break;
            default:
                break;
        }
        render();
    }
    analyzeModel(gltf) {
        //  snapPoints = [];
        this.targets = [];
        var container = this;
    
        gltf.scene.traverse(function (child) {
            if (child.name.substr(0, 3) == "_as" && !child.isMesh) {
    
                var snap = child.name.substring(3, child.name.lastIndexOf('_'));
                child.snap = snap;
                child.decorObj = container;
                container.snapPoints.push(child);
            }

            if(child.name == "camera1"){
                console.log("found camera");
                container.camera = child;
            }
            if(child.name == "camera1_Orientation"){
                container.camera1_Orientation = child;
            }
    
            if (child.isMesh) {
                if (child.material.opacity != 1) child.material.transparent = true;
                if (child.material.map) {
                    child.material.map.encoding = THREE.sRGBEncoding;
                    child.material.dithering = true;
                    child.material.flipY = false;
                };
                if (child.name.substr(0, 4) == container.defaultMaterialKey && container.defaultMaterial != null) { 
                    child.material = container.defaultMaterial;
                    if(container.defaultMaterialExtension != "none") container.changeSKU(container.defaultMaterialExtension);
                };
                child.castShadow = true;
                child.receiveShadow = true;
                switch (child.name.substr(0, 3)) {
                    case 'woo':
                        // child.material = SharedMaterials.getMaterialFromID('lightWood');
                        //targetMat = child.material;
                        //  child.material.map.wrapS = THREE.RepeatWrapping;
                        //  child.material.map.wrapT = THREE.RepeatWrapping;
                        //child.material.roughness = 0;
                        //child.material.metalness = 1;
                        break;
                    case 'gla':
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
                        child.decorObj = container;
                        child.decorParent = child.parent;
                        child.visible = false;
                        child.material = SnapMaterial;
                        //is this a drag plane?
                        let ln = child.geometry.getAttribute('position').array.length;
                        // 4 vertices gives 12 buffergeometry values.
                        if(child.name.includes("3dp")){
                            child.isPlane = true;
                        } else{
                            child.isPlane = false;
                        }

                        if(snap == "wall") container.wallArray.push(child);

                        break;
                    case '_af':
                        //  child.visible = false;
                        // container.snapPoints.push(child);
                        var snap = child.name.substring(3, child.name.lastIndexOf('_'));
                        child.snap = snap;
                        child.decorObj = container;
                        child.visible = false;
                        child.material = SnapMaterial;
                        break;
                    case '_bo': // Boolean operator
                        child.material.visible = false;
                        container.booleanObj = child;
                        container.booleanParent = child.parent;
                        break;
                    case '_ao':
                        /* child.receiveShadow = false;
                         child.castShadow = false;
             
                         child.material = new THREE.MeshBasicMaterial({ map: child.material.map });
                         child.material.setColor(0xFFFFFF);
                         // child.material.side = THREE.DoubleSide;
                         child.material.shininess = 0;
                         child.material.blending = THREE.MultiplyBlending;
                         child.material.transparent = true;
                        // child.material.dithering = true;*/
                        child.visible = false;
                        break;
                    case '_li': //linen
                        /* child.material.metalness = 0.0;
                         child.material.roughness = 0.9; 
                         child.material.setColor(0xFF0000)*/
    
                        break;
                    case "_bb": // alternative bounding box for snap
                        child.material.visible = false;   
                        container.fakeBoundingBox = child;
                        break;
    
                    default:
                        break;
    
                }
            }
        });
    }


}

export default DecorAnimated
