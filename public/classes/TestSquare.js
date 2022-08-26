
import { Object3D } from '/three/build/three.module.js';
import * as THREE from '/three/build/three.module.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/three/examples/jsm/loaders/DRACOLoader.js';
import SnapMaterial from '/js/SnapMaterial.js';



class TestSquare extends Object3D{

    constructor() { 
        super();

    this.classtype = 'DecorObject';
    this.targets = [];
    this.snapPoints = [];
    this.accessories = [];
    this.accessoryLayer = new THREE.Object3D();
    this.accessoryLayer.name = "accessories";
    this.add(this.accessoryLayer);
    this.scene = null;
    this.defaultMaterial = null;
    this.defaultMaterialKey = '';
    this.defaultMaterialExtension;
    this.sku = '';
    this.snap_type = '';
    this.exclude = '';
    this.flipX = false;
    this.isGroupMember = false;
    this.decorId = '';
    this.gph = new THREE.Vector3(); // global position helper
    this.gph2 = new THREE.Vector3(); // global position helper 2
    this.booleanObj = null;
    this.metadata = '';
    this.model = null;
    this.includeByDefault = false; //whether should appear as seperate item in basket
    this.hasUI = false;
    this.signature = null; //all metadata about this object, including materials and accessories.
    this.defaultMaterialID; 
    this.sku;
    this.name;
    this.decorId;
    this.model;
    this.gltf;
    this.properties = [
        {title:'remove', ui:'alert_button'}
    ]
    
    };

    loadParameters(){
        console.log("loading params");
        let lang = DD2022.lang;
        
        let scope = this;
        fetch(DD2022.server_path + "/clients/getmodel/" + lang + "/" + this.sku + "/" + this.decorId)
        .then(response => response.json())
            .then(data => {
                scope.signature = data;
                scope.signature.properties = scope.properties; 
                scope.signature.default_material_key = data.params.default_material_key;
                // selected DecorObject menu may have been drawn prior to loading. Redraw using force paramater
                DD2022.loadMenu(scope, true);
            })

    }

    setProperty(prop,value) {
        if(prop == "mirror"){
            this.toggleFlip();
        }
        if(prop == "normal_orientation"){
            if(this.flipX) this.toggleFlip();
        }
        if(prop == "mirror_orientation"){   
            if(!this.flipX) this.toggleFlip();

        }

    }

    setMetaData(dataStr){

    }

    registerProperties(){
        this.properties = [
            {title:'remove', ui:'alert_button'}
        ]
        //may be accessory without signature
       /* if( this.signature && this.signature.mirror == "1"){
            this.properties.push({title:'mirror', ui:'toggle', icon:'mirror.png'});
        }*/
        if(this.signature) this.signature.properties = this.properties;
    }


    loadModel (id, model, sku, cb) {
      
        this.sku = sku;
        this.name = sku;
        this.decorId = id;
        this.model = model;
        
    
    
    
        const loader = new GLTFLoader().setPath(ltvs__source +'/glb/');
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(ltvs__source + '/three/examples/jsm/libs/draco/gltf/');
        loader.setDRACOLoader(dracoLoader); 
        
        let scope = this;
    
        loader.load(model, (gltf) => {
    
            this.add(gltf.scene);
            this.gltf = gltf;
            this.scene = gltf.scene;
            this.analyzeModel(gltf);
            if (cb) {
                cb();
                scope.delayedMaterialAssignment();
            }
            this.registerProperties();
            this.checkOrientation();
    
        })
    }

    delayedMaterialAssignment(){
       let timer = setTimeout(() => {
            this.assignMat();
        },10);
    }
    assignMat(){
        console.log("delayed assign", this);
        this.changeMaterial(this.defaultMaterialKey,this.defaultMaterial,this.defaultMaterialExtension,this.defaultMaterialID);
    }
    injectModel(model){
        this.signature = {};
        let scope = this;
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(ltvs__source + '/three/examples/jsm/libs/draco/gltf/');
        loader.setDRACOLoader(dracoLoader); 
        loader.parse( model, '', function ( gltf) {
            scope.add(gltf.scene);
            scope.gltf = gltf;
            scope.scene = gltf.scene;
            scope.analyzeModel(gltf);
            scope.registerProperties();
            scope.checkOrientation();
            scope.snap_type = "surface";
            render();
        });
        
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
    
                    default:
                        break;
    
                }
            }
        });
    }


    assignDefaultMaterial(key, material, extension, matid) {
        this.defaultMaterial = material;
        this.defaultMaterialKey = key;
        this.defaultMaterialID = matid;
        this.defaultMaterialExtension = extension;
        /*let containsKey = false;
        //incase material comes AFTER load, re-traverse the scene and apply
        let container = this;
        if (this.scene) {
            this.scene.traverse(function (child) {
                if (child.isMesh) {
                    if (child.name.substr(0, 4) == container.defaultMaterialKey && container.defaultMaterial != null) { 
                        child.material = container.defaultMaterial 
                    containsKey = true;
                    };
                }
            });
        }
        if(containsKey && extension != "none") this.changeSKU(extension);
        */
       this.changeMaterial(key, material, extension, matid);
    }
    
    changeSKU(extension) {

        //check for mulitple parts
        let multi = this.sku.split('+');
        if(multi.length > 1){
            let container = this;
            if (extension.length > 0) {
                let new_sku = "";
                for(var i=0;i<multi.length;i++){
                    let dashInd = multi[i].lastIndexOf('-');
                    if (dashInd > 0) {
                        let sku1 = multi[i].substr(0, dashInd);
                        new_sku += sku1 + '-' + extension;
                        if(i<multi.length -1) new_sku += '+';
                    }
                };
                container.sku = new_sku; 
            }


        }else{
    
            let container = this;
            if (extension.length > 0) {
                let dashInd = container.sku.lastIndexOf('-');
                if (dashInd > 0) {
                    let sku1 = container.sku.substr(0, dashInd);
        
                    container.sku = sku1 + '-' + extension;
        
                }
            }
        }
    }
    
    turnOnSnapPoints(snapID) {
        this.turnOffSnapPoints();
        let snaps = [];
        let scope = this;
        this.snapPoints.forEach(function (sp) {
            if (sp.snap == snapID) {
                sp.visible = true;
                sp.decorParent.add(sp);
                snaps.push(sp);
            }
        });
        // add any snap points from accessories
        /*this.accessories.forEach(function (acc) {
            var accSnaps = acc.turnOnSnapPoints();
            snaps = snaps.concat(accSnaps);
        });*/
        this.accessoryLayer.children.forEach(function (acc) {
            snaps = snaps.concat(acc.turnOnSnapPoints(snapID));
        })
        return snaps;
    }
    getSnapPoints(snapID){
        let snaps = [];
        let scope = this;
        this.snapPoints.forEach(function (sp) {
            if (sp.snap == snapID) {
                snaps.push(sp);
            }
        });
        this.accessoryLayer.children.forEach(function (acc) {
            snaps = snaps.concat(acc.getSnapPoints(snapID));
        })
        return snaps;
    }
    turnOffSnapPoints() {
       // this.snapPoints.forEach(function (sp) { sp.visible = false; });
        this.snapPoints.forEach(function (sp) {
            if(sp.parent){
                sp.decorParent = sp.parent;
                sp.parent.remove(sp); 
            }
        });
        this.accessoryLayer.children.forEach(function (acc) {
            acc.turnOffSnapPoints();
        })
    }
    
   
    loadAccesory(model, target) {
        let decor = new DecorObject();
        decor.position.copy(target.position);
        decor.quaternion.copy(target.quaternion);
        this.accessoryLayer.add(decor);
        decor.loadModel(model);
        this.accessories.push(decor);
    }
    changeMaterial(key, material, extension,matid) {
    
        let container = this;
        let containsKey = false;
        this.defaultMaterialID = matid;
        if (this.scene != null) {
            this.scene.traverse(function (child) {
                if (child.name.substr(0, 4) == key) {
                    child.material = material;
                    containsKey = true;
                }
            });
            let layer = this.accessoryLayer;
            layer.children.forEach(function (child) {
                child.changeMaterial(key, material, extension, matid);
            });
            if (containsKey) container.changeSKU(extension);
    
            render();
        }
    
    }
    
    addAccessory(acc) {
        this.removeAccessoryAt(acc);
        this.accessoryLayer.add(acc);
    }
    getAccessories() {
        let accs = this.accessoryLayer.children;
        let layer = this.accessoryLayer;
        layer.children.forEach(function (item) {
            accs = accs.concat(item.getAccessories());
        });
    
        return accs;
    }
    getAccessoryAt(positionObj) {
        let layer = this.accessoryLayer;
        let occupied = false;
        
        layer.children.forEach(function (item) {
            if (item.position.equals(positionObj) && item.snap == positionObj.snap) {
                occupied = item;
            };
        });
        return occupied;
    }
    createHoles(){
        //optional function to create holes using booleans
    }
    checkOrientation(){
        if(this.flipX){
            this.reverseMaterialMaps(-1);
        }
    }
    removeAccessory(acc) {
        let layer = this.accessoryLayer;
        layer.children.forEach(function (child) {
            child.removeAccessory(acc);
            if (child == acc) { layer.remove(acc) };
            
        });
    }
    removeAccessoryAt(positionObj) {
    
        let layer = this.accessoryLayer;
        let gp = this.gph;
        let gp2 = this.gph2;
        positionObj.getWorldPosition (gp);
        
        layer.children.forEach(function (item) {
            item.removeAccessoryAt(positionObj);
            item.getWorldPosition (gp2);
            if (gp.equals(gp2) && item.snap == positionObj.snap) {
                layer.remove(item);
            }
        })
    }
    removeAllAccessoriesBySnap(snap){
        let layer = this.accessoryLayer;
      
        let item;
        for(var i=layer.children.length-1;i>-1;i--){
            item = layer.children[i];
            item.removeAllAccessoriesBySnap(snap);
            if (item.snap == snap) {
                layer.remove(item);
            }
        }
        render();
    }
    toggleFlip() {
        if (this.flipX) {
            this.scale.set(1,1,1);
            this.reverseMaterialMaps(1);
            //reverse maps
            this.flipX = false;
        } else {
            this.scale.set(-1,1,1);
            //reverse maps
            this.reverseMaterialMaps(-1);
            this.flipX = true;
        }
        //this.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
        
        render();
    
    }
    reverseMaterialMaps(value){
        this.scene.traverse(function (child) {
            if (child.isMesh && child.material) {
                if(child.material.map){
                    child.material.map.repeat.x = value;
                }   
            }
        });
        this.accessoryLayer.children.forEach( obj =>{
            obj.reverseMaterialMaps(value);
        })
    }
    removeBySKU(sku) {
        let layer = this.accessoryLayer;
    
        for (var i = layer.children.length - 1; i > -1; i--) {
            layer.children[i].removeBySKU(sku);
            if (layer.children[i].sku == sku) {
    
                layer.remove(layer.children[i]);
            }
    
        };
    
    }
    drawBounding(prefix, show = true) {
        var container = this;
        var boxes = [];
        var prefixlength = prefix.length;
        var scope = this;
        let layer = this.accessoryLayer;
        if (this.scene) {
            this.scene.traverse(function (child) {
                if (child.isMesh) {
                    if (child.name.substr(0, prefixlength) == prefix) {
                        
                        let box = new THREE.Box3();
                        box.setFromObject(child);
                        boxes.push(box);
                        if (show) {
                            let helper = new THREE.Box3Helper(box, 0xffff00);
                            scope.scene.add(helper);
                        }
                    }
                }
            });
        }
        layer.children.forEach(function (item) {
           boxes = boxes.concat(item.drawBounding(prefix,show)); 
        });

        return boxes;
    }
    drawOccupied(exclude, show = true) {
        var boxes = [];
        let layer = this.accessoryLayer;
        var scope = this;
        if(exclude && exclude.length > 0){
            let exclusionArray = exclude.split(',');
             exclusionArray.forEach(function(snapid){
                layer.children.forEach(function (item) {
                    if (item.snap == snapid) {
                        let box = new THREE.Box3();
                                box.setFromObject(item);
                                boxes.push(box);
                                if (show) {
                                    let helper = new THREE.Box3Helper(box, 0xffff00);
                                    scope.scene.add(helper);
                                }
                    };
                    boxes.concat(item.drawOccupied(exclude,show));
                });
            });
         }
        
        return boxes;
    }
    getMetaData(){
        return this.metadata;
    }

}

export default TestSquare




