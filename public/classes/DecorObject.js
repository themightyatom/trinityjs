import { Object3D } from '/three/build/three.module.js';
import * as THREE from '/three/build/three.module.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/three/examples/jsm/loaders/DRACOLoader.js';
import SnapMaterial from '/js/SnapMaterial.js';


class DecorObject extends Object3D {
    
    constructor() { 
        super();

    this.type = 'DecorObject';
    this.targets = [];
    this.snapPoints = [];
    this.accessories = [];
    this.accessoryLayer = new THREE.Object3D();
    this.accessoryLayer.name = "accessories";
    this.add(this.accessoryLayer);
    this.scene = null;
    this.defaultMaterial = null;
    this.defaultMaterialKey = '';
    this.sku = '';
    this.snap_type = '';
    this.exclude = '';
    this.flipX = false;
    this.isGroupMember = false;
    this.decorid = '';
    this.gph = new THREE.Vector3(); // global position helper
    this.gph2 = new THREE.Vector3(); // global position helper 2
    };

    

    doSomething() {
        console.log("done");
    }
    loadModel (id, model, sku, cb) {
        const loadmanager = new THREE.LoadingManager();
        // make sure new objects are rendered after load
        loadmanager.onLoad = function () {
            render();
    
        };
        this.sku = sku;
        this.name = sku;
        this.decorid = id;
    
    
    
        const loader = new GLTFLoader(loadmanager).setPath(ltvs__source +'/glb/');
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/three/examples/jsm/libs/draco/gltf/');
        loader.setDRACOLoader(dracoLoader);
    
    
        loader.load(model, (gltf) => {
    
            this.add(gltf.scene);
            this.scene = gltf.scene;
            this.analyzeModel(gltf);
            if (cb) {
                cb();
            }
    
        })
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
                };
                if (child.name.substr(0, 4) == container.defaultMaterialKey && container.defaultMaterial != null) { child.material = container.defaultMaterial };
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
                        child.decorObj = container;
                        child.visible = false;
                        child.material = SnapMaterial;
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


    assignDefaultMaterial(material, key, extension) {
        this.defaultMaterial = material;
        this.defaultMaterialKey = key;
        //incase material comes AFTER load, re-traverse the scene and apply
        let container = this;
        if (this.scene) {
            this.scene.traverse(function (child) {
                if (child.isMesh) {
                    if (child.name.substr(0, 4) == container.defaultMaterialKey && container.defaultMaterial != null) { child.material = container.defaultMaterial };
                }
            });
        }
        this.changeSKU(extension);
    }
    
    changeSKU(extension) {
    
        let container = this;
        if (extension.length > 0) {
            let dashInd = container.sku.lastIndexOf('-');
            if (dashInd > 0) {
                let sku1 = container.sku.substr(0, dashInd);
    
                container.sku = sku1 + '-' + extension;
    
            }
        }
    }
    
    turnOnSnapPoints(snapID) {
        this.turnOffSnapPoints();
        let snaps = [];
        this.snapPoints.forEach(function (sp) {
            if (sp.snap == snapID) {
                sp.visible = true;
                snaps.push(sp);
            }
        });
        // add any snap points from accessories
        this.accessories.forEach(function (acc) {
            var accSnaps = acc.turnOnSnapPoints();
            snaps = snaps.concat(accSnaps);
        });
        return snaps;
    }
    turnOffSnapPoints() {
        this.snapPoints.forEach(function (sp) { sp.visible = false; });
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
    changeMaterial(key, material, extension) {
    
        let container = this;
        let containsKey = false;
        if (this.scene != null) {
            this.scene.traverse(function (child) {
                if (child.name.substr(0, 4) == key) {
                    child.material = material;
                    containsKey = true;
                }
            });
            let layer = this.accessoryLayer;
            layer.children.forEach(function (child) {
                child.changeMaterial(key, material, extension);
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
    toggleFlip() {
        if (this.flipX) {
            this.flipX = false;
        } else {
            this.flipX = true;
        }
        this.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    
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
        
        if (this.scene) {
            this.scene.traverse(function (child) {
                if (child.isMesh) {
                 
                    if (child.name.substr(0, prefixlength) == prefix) {
                        
                        let box = new THREE.Box3();
                        box.setFromObject(child);
                        boxes.push(box);
                        if (show) {
                            let helper = new THREE.Box3Helper(box, 0xffff00);
                            scene.add(helper);
                        }
                    }
                }
            });
        }
        return boxes;
    }
    drawOccupied(snap, show = true) {
        
        var boxes = [];
        let layer = this.accessoryLayer;
        layer.children.forEach(function (item) {
            if (item.snap == snap) {
                let box = new THREE.Box3();
                        box.setFromObject(item);
                        boxes.push(box);
                        if (show) {
                            let helper = new THREE.Box3Helper(box, 0xffff00);
                            scene.add(helper);
                        }
            };
        });
        return boxes;
    }

}

export default DecorObject