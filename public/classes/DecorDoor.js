import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class DecorDoor extends DecorObject {
    constructor() {
        super();
        this.defaultY = 0;
        this.metadata = '';
        this.classtype = "DecorDoor";
        this.isWallMounted = true;
        this.YAXIS = new THREE.Vector3(0, 1, 0);
        this.door;
        this.frame;
        this.defaultopen = 40;
        this.currentFrameColor = '#FFFFFF';
        this.currentWidth = 88.7; //default values
        this.currentHeight = 211;
        this.widthmax = 300;
        this.widthmin = 50;
        this.heightmax = 300;
        this.heightmin = 100;
        this.meshes = [];
        this.refPositions = [];
        this.positions = [];
        this.originalHalfWidth = 0;
        this.originalHeight = 0;
        this.hingePos;
        this.doorRef;
        this.properties = [

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
        console.log("ready");
        // this.getVerts();
        let scope = this;
        this.scene.traverse(function (child) {

            if (child.isMesh) {
                console.log("CHILD", child.name);
                scope.meshes.push(child);

                let pos = child.geometry.getAttribute('position').array;
                scope.positions.push(pos);
                scope.refPositions.push(pos.slice());

                //find the maximum x position, to calculate half width
                if (child.name != "door") {
                    for (var i = 0; i < pos.length; i += 3) {
                        if (pos[i] > scope.originalHalfWidth) scope.originalHalfWidth = pos[i];
                        if (pos[i + 1] > scope.originalHeight) scope.originalHeight = pos[i + 1];
                    }
                }
                switch (child.name) {
                    case "door":
                        scope.door = child;
                        scope.door.rotateOnAxis(scope.YAXIS, scope.defaultopen * (Math.PI / 180));
                        scope.hingePos = child.position.x;
                        scope.doorRef = scope.refPositions.length - 1; //index of door vertices

                        break;
                    case "frame":
                        scope.frame = child;
                        break;
                    default:
                        break;

                }
                /*window.envmeshes.push(child);
                let pos = child.geometry.getAttribute('position').array;
                window.positions.push(pos);
                window.refPositions.push(pos.slice());*/
                child.castShadow = false;
            }

        })
        this.setUpDefaults();

    }
    setUpDefaults() {

        //set defaults
        this.setHeight(this.currentHeight);
        this.setWidth(this.currentWidth);
        this.changeFrameColor(this.currentFrameColor);
        this.firstrun = false;

    }
    getMetaData() {
        return this.currentWidth + "," + this.currentHeight + "," + this.currentFrameColor;
    }
    setMetaData(dataStr){
        let values = dataStr.split(',');
        this.currentWidth = values[0];
        this.currentHeight = values[1];
        this.currentFrameColor = values[2];
    }
    setProperty(prop, value) {
        console.log(prop, value);
        switch (prop) {
            case "angle":
                this.defaultopen = value;
                this.door.setRotationFromAxisAngle(this.YAXIS, value * (Math.PI / 180));
                this.registerProperties();
                break;
            case "hinge":
                if (this.scale.x < 0) {
                    this.scale.set(1, 1, 1);
                } else {
                    this.scale.set(-1, 1, 1);
                }

                break;
            case "width":
                this.setWidth(value);
                break;
            case "height":
                this.setHeight(value);
                break;
            case "color":
                this.changeFrameColor(value);
            default:
                break;
        }
        render();
    }


    registerProperties() {
        this.properties = [
            { title: 'angle', ui: 'slider', range: [-60, 60], value: this.defaultopen, images: ['door-out.svg', 'door-in.svg'] },
            { title: 'hinge', ui: 'toggle', icon: 'mirror.png' },
            { title: 'width', ui: 'spinner', range: [this.widthmin, this.widthmax], value: this.currentWidth, icon: 'width.svg' },
            { title: 'height', ui: 'spinner', range: [this.heightmin, this.heightmax], value: this.currentHeight, icon: 'height.svg' },
            { title: 'color', ui: 'colorpicker', value: this.currentWallColor, icon: 'wallcolor.svg' },
            { title: 'remove', ui: 'alert_button' }
        ]
        this.signature.properties = this.properties;
    }
    setWidth(value) {

        if (value > this.widthmax) value = document.getElementById('ltvs__width').value = this.widthmax;
       // if (value < this.widthmin) value = document.getElementById('ltvs__width').value = this.widthmin;
        if (value < this.widthmin) return;
        let metervalue = value / 100;//convert to meters
        this.currentWidth = value;
        for (var m = 0; m < this.meshes.length; m++) {
            for (var i = 0; i < this.positions[m].length; i += 3) {
                if (this.refPositions[m][i] > 0.1) this.positions[m][i] = metervalue / 2 + (this.refPositions[m][i] - this.originalHalfWidth); //keep offsets, scurting boards, etc.
                if (this.refPositions[m][i] < -0.1) this.positions[m][i] = -(metervalue / 2) + (this.refPositions[m][i] + this.originalHalfWidth);
            }
        }
        //special case for door, with left hand origin
         for (var p = 0; p < this.positions[this.doorRef].length; p += 3) {
            if (this.refPositions[this.doorRef][p] > 0.5) this.positions[this.doorRef][p] = this.refPositions[this.doorRef][p] + ((metervalue - this.originalHalfWidth*2)); //keep offsets, scurting boards, etc.
         }

        this.update();

    }
    setHeight(value) {
        //let value = document.getElementById('ltvs__height').value; //convert to meters
        if (value > this.heightmax) value = document.getElementById('ltvs__height').value = this.heightmax;
       // if (value < this.heightmin) value = document.getElementById('ltvs__height').value = this.heightmin;
        if (value < this.heightmin) return;
        let metervalue = value / 100;//convert to meters
        this.currentHeight = value;
        //set height = 2.5m
        for (var m = 0; m < this.meshes.length; m++) {
            for (var i = 1; i < this.positions[m].length; i += 3) {

                //if (this.refPositions[m][i] > 0.5) this.positions[m][i] = metervalue;
                if (this.refPositions[m][i] > 0.5) this.positions[m][i] = metervalue + (this.refPositions[m][i] - this.originalHeight);
            }
        }
        this.update();
    }
    changeFrameColor(value) {
        this.currentFrameColor = value;
        //let value = document.getElementById('ltvs__wallcolor').value;
        if (typeof value === 'string') {
            value = value.replace('#', '0x');
        }

        this.frame.material.color.setHex(value);
        this.door.material.color.setHex(value);


        this.update();
        // this.wallmat.setColor(value);
        render();
    }

    update() {

        for (var m = 0; m < this.meshes.length; m++) {
            this.meshes[m].geometry.attributes.position.needsUpdate = true;

            //Essential for subsequent raycasting. Otherwise uses original size
            this.meshes[m].geometry.computeBoundingBox();
            this.meshes[m].geometry.computeBoundingSphere();

        }
        if (this.parent && this.parent.parent && this.parent.parent.isRoom) {
            this.parent.parent.createHoles();
        }
        let distDif = (this.currentWidth / 200) - (this.originalHalfWidth);
        this.door.position.x = this.hingePos - distDif;
        render();
    }

}

export default DecorDoor
