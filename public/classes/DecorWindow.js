import DecorObject from '/classes/DecorObject.js';

class DecorWindow extends DecorObject {
    constructor() {
        super();
        this.defaultY = 0.6;
        this.metadata = '';
        this.classtype = 'DecorWindow';
        this.isWallMounted = true;
        this.hasUI = true;
        this.refPositions = [];
        this.positions = [];
        this.properties;
        this.currentFrameColor = '#FFFFFF';
        this.currentWidth = 116; //default values
        this.currentHeight = 144;
        this.widthmax = 1000;
        this.widthmin = 30;
        this.heightmax = 1000;
        this.heightmin = 30;
        this.meshes = [];
        this.frame = null;
        this.originalHalfWidth = 0;
        this.originalHeight = 0;

    }
    loadModel(id, model, sku, cb) {
        let host = this;
        super.loadModel(id, model, sku, function () {

            host.loadedcallback();
            cb();
        });

        console.log("WINDOW OBJECT CREATED", this);

    }
    loadedcallback() {
        console.log("ready");
        // this.getVerts();
        let windowObj = this;
        this.scene.traverse(function (child) {

            if (child.isMesh) {
                console.log("CHILD", child.name);
               
                child.castShadow = false;
                

                windowObj.meshes.push(child);
                let pos = child.geometry.getAttribute('position').array;
                windowObj.positions.push(pos);
                windowObj.refPositions.push(pos.slice());
                //find the maximum x position, to calculate half width
                for(var i=0;i<pos.length;i+=3){
                    if(pos[i]>windowObj.originalHalfWidth) windowObj.originalHalfWidth = pos[i];
                    if(pos[i+1]>windowObj.originalHeight) windowObj.originalHeight = pos[i+1];
                }

                if(child.name.substr(0,5) == "frame"){
                    windowObj.frame = child;
                }

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
        this.registerProperties();

    }

    registerProperties() {
        this.properties = [
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
        if (value < this.widthmin)return;
        let metervalue = value / 100;//convert to meters
        this.currentWidth = value;
        for (var m = 0; m < this.meshes.length; m++) {
            for (var i = 0; i < this.positions[m].length; i += 3) {
                if (this.refPositions[m][i] > 0.1) this.positions[m][i] = metervalue / 2 + (this.refPositions[m][i] - this.originalHalfWidth); //keep offsets, scurting boards, etc.
                if (this.refPositions[m][i] < -0.1) this.positions[m][i] = -(metervalue / 2) + (this.refPositions[m][i] + this.originalHalfWidth);
            }
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
        if(this.parent && this.parent.parent && this.parent.parent.isRoom){
            this.parent.parent.createHoles();
        }
        render();
    }


}

export default DecorWindow
