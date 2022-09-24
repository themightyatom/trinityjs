import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';
import { Reflector } from '/js/DecorReflector.js';
import SnapMaterial from '/js/SnapMaterial.js';

class GlassPartition extends DecorObject {

    constructor() {
        super();
        this.classtype = 'GlassPartition';
        this.isWallMounted = true;
        this.defaultWidth = 100;
        this.defaultHeight = 100;
        this.defaultDepth = 100;
        this.currentWidth = 100;
        this.currentHeight = 100;
        this.currentDepth = 100;
        this.currentColor = "#000000";
        this.widthmin = 10;
        this.widthmax = 10000;
        this.depthmin = 10;
        this.depthmax = 10000;
        this.heightmax = 10000;
        this.heightmin = 10;
        this.mesh = null;
        this.mat = null;
        this.scene = null;
        this.glass = null;
        this.glassReverse = null;
        this.strut = null;
        this.strutLayer = new THREE.Object3D();
        this.add(this.strutLayer);

        this.snapSurface = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), SnapMaterial);
        this.snapSurface.position.y = this.currentHeight/200;
        this.snapSurface.position.z = 0.03;
        this.snapSurface.isPlane = true;
        this.snapSurface.name = "_aswall_0";
       // this.snapSurface.visible = false;
      

        this.snapSurface2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), SnapMaterial);
        this.snapSurface2.position.y = this.currentHeight/200;
        this.snapSurface.position.z = -0.03;
        this.snapSurface.rotation.y = Math.PI/2;
        this.snapSurface2.isPlane = true;
        this.snapSurface2.name = "_aswall_1";
        //this.snapSurface2.visible = false;
        this.add(this.snapSurface);
        this.add(this.snapSurface2);

        this.snapPoints.push(this.snapSurface,this.snapSurface2);
        this.wallArray.push(this.snapSurface,this.snapSurface2);
    }

    loadModel(id, model, sku, cb) {
        let host = this;
        this.cb = cb;
        super.loadModel(id, model, sku, function () {
            console.log("my Callback", cb);
            host.registerProperties();
            host.loadedcallback();
            cb();
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
                    if (container.defaultMaterialExtension != "none") container.changeSKU(container.defaultMaterialExtension);
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
                        if (child.name.includes("3dp")) {
                            child.isPlane = true;
                        } else {
                            child.isPlane = false;
                        }

                        if (snap == "wall") container.wallArray.push(child);

                        break;

                    case '_bo': // Boolean operator
                        child.material.visible = false;
                        container.booleanObj = child;
                        container.booleanParent = child.parent;
                        break;
                    case "_bb": // alternative bounding box for snap
                        child.material.visible = false;
                        container.fakeBoundingBox = child;
                        break;

                    default:
                        break;

                }
                switch (child.name) {
                    case "strut":
                        container.strut = child;
                        child.visible = false;
                        container.mat = child.material;
                        break;
                    case "glass":

                        container.glass = new Reflector(child.geometry, {
                            clipBias: 0.003,
                            textureWidth: 1024,
                            textureHeight: 1024,
                            color: 0x313737
                        });

                        container.glass.material.transparent = true;
                        container.glass.receiveShadow = false;
                        container.glass.castShadow = false;
                        container.glass.position.z = 0.01;


                        child.parent.add(container.glass);

                        child.visible = false;

                        container.glassReverse = new Reflector(child.geometry, {
                            clipBias: 0.003,
                            textureWidth: 1024,
                            textureHeight: 1024,
                            color: 0x313737
                        });

                        container.glassReverse.material.transparent = true;
                        container.glassReverse.receiveShadow = false;
                        container.glassReverse.castShadow = false;
                        container.glassReverse.rotation.y = Math.PI;
                        container.glassReverse.position.z = -0.01;


                        container.add(container.glassReverse);

                        child.visible = false;
                        break;
                   

                    default:
                        break;
                }
            }
        });
    }
    loadedcallback() {
        /*let i;
        for(i=0;i<this.children.length;i++){
            if(this.children[i].name =="Scene"){
                this.scene = this.children[i];
               this.mat = this.children[i].children[0].material;
               this.mesh = this.children[i].children[0];
            }
        }*/
        let measure = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.scene).getSize(measure);
        this.defaultWidth = Math.round(measure.x * 100);

        this.defaultHeight = Math.round(measure.y * 100);
        this.defaultDepth = Math.round(measure.z * 100);

        if (this.currentWidth == 100) this.currentWidth = this.defaultWidth;
        if (this.currentHeight == 100) this.currentHeight = this.defaultHeight;
        if (this.currentDepth == 100) this.currentDepth = this.defaultDepth;
        console.log(measure);
        this.setUpDefaults();
    }

    setUpDefaults() {

        //set defaults
        this.setHeight(this.currentHeight);
        this.setWidth(this.currentWidth);
        this.setDepth(this.currentDepth);
        this.changeWallColor(this.currentColor);
        this.firstrun = false;

        /*let geometry = new THREE.PlaneGeometry(1, 1);
        let verticalMirror = new Reflector(geometry, {
            clipBias: 0.003,
            textureWidth: 1024,
            textureHeight: 1024,
            color: 0x889999
        });
        verticalMirror.position.y = 1;
        verticalMirror.material.transparent = true;*/

        //this.add( verticalMirror );

    }

    setProperty(prop, value) {

        switch (prop) {
            case "width":
                this.setWidth(value);
                break;
            case "depth":
                this.setDepth(value);
                break;
            case "height":
                this.setHeight(value);
                break;
            case "color":
                this.changeWallColor(value);
            default:
                break;
        }
        this.registerProperties();

    }

    registerProperties() {
        this.properties = [
            { title: 'width', ui: 'spinner', range: [this.widthmin, this.widthmax], value: this.currentWidth, icon: 'width.svg' },
            { title: 'height', ui: 'spinner', range: [this.heightmin, this.heightmax], value: this.currentHeight, icon: 'height.svg' },
            { title: 'remove', ui: 'alert_button' }
        ]
        this.signature.properties = this.properties;
    }

    setWidth(value) {

        if (value > this.widthmax) value = document.getElementById('ltvs__width').value = this.widthmax;
        if (value < this.widthmin) return;

        this.currentWidth = value;
        this.glass.scale.x = this.currentWidth / this.defaultWidth;
        this.glassReverse.scale.x = this.currentWidth / this.defaultWidth;
        this.update();
        render();



    }
    setHeight(value) {
        if (value > this.heightmax) value = document.getElementById('ltvs__height').value = this.heightmax;
        if (value < this.heightmin) return;

        this.currentHeight = value;
        this.glass.scale.y = this.currentHeight / this.defaultHeight;
        this.glassReverse.scale.y = this.currentHeight / this.defaultHeight;
        this.update();
        render();
    }
    setDepth(value) {
        if (value > this.depthmax) value = document.getElementById('ltvs__depth').value = this.depthmax;
        if (value < this.depthmin) return;

        this.currentDepth = value;
        this.glass.scale.z = this.currentDepth / this.defaultDepth;
        this.glassReverse.scale.z = this.currentDepth / this.defaultDepth;
        this.update();
        render();
    }
    changeWallColor(value) {

        //let value = document.getElementById('ltvs__wallcolor').value;
        if (typeof value === 'string') {
            value = value.replace('#', '0x');
        }
        this.currentColor = value;
        this.mat.color.setHex(value);


        render();
    }

    getMetaData() {
        return this.currentWidth + "," + this.currentHeight + "," + this.currentDepth + "," + this.currentColor;
    }
    setMetaData(dataStr) {
        let values = dataStr.split(',');
        this.currentWidth = values[0];
        this.currentHeight = values[1];
        this.currentDepth = values[2];
        this.currentColor = values[3];
    }

    update() {

        this.scene.traverse(function (child) {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                child.geometry.computeBoundingSphere();
            }
        });
        while (this.strutLayer.children.length > 0) {
            this.strutLayer.remove(this.strutLayer.children[this.strutLayer.children.length - 1]);
        }
        let bottom = this.strut.clone();
        bottom.visible = true;
        bottom.name = "bottom";
        bottom.position.y = 0.03;
        this.strutLayer.add(bottom);
        let top = this.strut.clone();
        top.visible = true;
        top.name = "top";
        this.strutLayer.add(top);
        top.position.y = (this.currentHeight / 100) - 0.03;

        top.scale.x = this.glass.scale.x;
        bottom.scale.x = this.glass.scale.x;

        let left = this.strut.clone();
        this.strutLayer.add(left);
        left.rotation.z = Math.PI / 2;
        left.position.x = -(this.currentWidth / 200) + 0.03;
        left.scale.x = this.glass.scale.y;
        left.visible = true;
        left.position.y = this.currentHeight / 200;

        let right = this.strut.clone();
        this.strutLayer.add(right);
        right.rotation.z = Math.PI / 2;
        right.position.x = (this.currentWidth / 200) - 0.03;
        right.scale.x = this.glass.scale.y;
        right.visible = true;
        right.position.y = this.currentHeight / 200;

        //verticles

        let numVerts = Math.round(this.currentWidth / 100);
        let vert;
        for (var i = 0; i < numVerts - 1; i++) {
            vert = this.strut.clone();
            vert.scale.y = 0.5;
            vert.scale.z = 0.5;
            vert.scale.x = this.glass.scale.y;
            vert.rotation.z = Math.PI / 2;
            vert.position.y = this.currentHeight / 200;
            vert.position.x = -(this.currentWidth / 200) + ((i + 1) * this.currentWidth / (100 * numVerts));
            vert.visible = true;
            this.strutLayer.add(vert);
        }

        this.snapSurface.position.y = this.snapSurface2.position.y = this.currentHeight/200;
        this.snapSurface.scale.x = this.snapSurface2.scale.x = this.currentWidth/100; 
        this.snapSurface.scale.y = this.snapSurface2.scale.y = this.currentHeight/100; 

        this.snapSurface.geometry.computeBoundingBox();
        this.snapSurface.geometry.computeBoundingSphere();

        
        this.snapSurface2.geometry.computeBoundingBox();
        this.snapSurface2.geometry.computeBoundingSphere();


    }




}

export default GlassPartition