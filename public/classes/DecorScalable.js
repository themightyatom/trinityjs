import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class DecorScalable extends DecorObject{

    constructor(){
        super();
        this.classtype = 'DecorScalable';
        this.isWallMounted = true;
        this.defaultWidth = 100;
        this.defaultHeight = 100;
        this.defaultDepth = 100;
        this.currentWidth = 100;
        this.currentHeight = 100;
        this.currentDepth = 100;
        this.currentColor = "#FFFFFF";
        this.widthmin = 10;
        this.widthmax = 10000;
        this.depthmin = 10;
        this.depthmax = 10000;
        this.heightmax = 10000;
        this.heightmin = 10;
        this.mesh = null;
        this.mat = null;
        this.scene = null;
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
    loadedcallback(){
        let i;
        for(i=0;i<this.children.length;i++){
            if(this.children[i].name =="Scene"){
                this.scene = this.children[i];
               this.mat = this.children[i].children[0].material;
               this.mesh = this.children[i].children[0];
            }
        }
        let measure = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.scene).getSize(measure);
        this.defaultWidth = Math.round(measure.x * 100);
        
        this.defaultHeight = Math.round(measure.y * 100);
        this.defaultDepth = Math.round(measure.z * 100);

        if(this.currentWidth == 100) this.currentWidth = this.defaultWidth;
        if(this.currentHeight == 100) this.currentHeight = this.defaultHeight;
        if(this.currentDepth == 100) this.currentDepth = this.defaultDepth;
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

    }

    setProperty(prop,value){
        
        switch(prop){
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

    registerProperties(){
        this.properties =[
            {title:'width', ui:'spinner', range:[this.widthmin, this.widthmax], value:this.currentWidth, icon:'width.svg'},
            {title:'depth', ui:'spinner', range:[this.depthmin, this.depthmax], value:this.currentDepth,icon:'depth.svg'},
            {title:'height', ui:'spinner', range:[this.heightmin, this.heightmax], value:this.currentHeight, icon:'height.svg'},
            {title:'color', ui:'colorpicker', value:this.currentColor, icon:'wallcolor.svg'},
            {title:'remove', ui:'alert_button'}
        ]
        this.signature.properties = this.properties;
    }

    setWidth(value){
        
        if (value > this.widthmax) value = document.getElementById('ltvs__width').value = this.widthmax;
        if (value < this.widthmin) return;

        this.currentWidth = value;
        this.scene.scale.x = this.currentWidth/this.defaultWidth;
        this.update();
        render();



    }
    setHeight(value){
        if (value > this.heightmax) value = document.getElementById('ltvs__height').value = this.heightmax;
        if (value < this.heightmin) return;

        this.currentHeight = value;
        this.scene.scale.y = this.currentHeight/this.defaultHeight;
        this.update();
        render();
    }
    setDepth(value){
        if (value > this.depthmax) value = document.getElementById('ltvs__depth').value = this.depthmax;
        if (value < this.depthmin) return;

        this.currentDepth = value;
        this.scene.scale.z = this.currentDepth/this.defaultDepth;
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
    setMetaData(dataStr){
        let values = dataStr.split(',');
        this.currentWidth = values[0];
        this.currentHeight = values[1];
        this.currentDepth = values[2];
        this.currentColor = values[3];
    }

    update(){

        this.scene.traverse(function (child) {
            if (child.isMesh) {
            child.geometry.computeBoundingBox();
            child.geometry.computeBoundingSphere();
            }
        });
        /*for(var i=0;i<this.snapPoints.length;i++){
            this.snapPoints[i].visible = true;
        }*/
    }




}

export default DecorScalable