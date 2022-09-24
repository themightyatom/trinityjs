import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class Lifetime8174 extends DecorObject {
    constructor() {
        super();
        this.metadata = '';
        this.classtype = "Lifetime8174";
        this.YAXIS = new THREE.Vector3(1, 0, 0);
        this.bounding;
        this.cHeight = 0.09;
        this.mixer;
        this.timescale = 86;
        this.totalDuration = 0;
        this.animationArray = [];
        this.turnedOn = false;
        this.col = 0x000000;
        this.defaultopen = 0;
        this.defaultAnimationValue = 0;
        this.properties = [
            { title: 'animate', ui: 'slider', range: [0, 86], value: this.defaultAnimationValue},
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

        this.setProperty("animate", this.defaultAnimationValue);


       // this.setProperty("angle", this.defaultangle);

    }

    setProperty(prop, value) {
        
        switch (prop) {
            case "animate":
                this.defaultAnimationValue = value;
                let timeValue = Math.max((value / this.timescale * this.totalDuration) - 0.0001, 0);
             

                if(timeValue > 0.2 && !this.turnedOn){
                    this.setGlow(true);
                }

                if(timeValue <= 0.2 && this.turnedOn){
                    this.setGlow(false)
                }
              
                this.mixer.setTime(timeValue);
                break;
            default:
                break;
        }
        render();
    }

    setGlow(value){
        this.turnedOn = value;

        if(value){
            this.col= 0xffdc63;
        }else{
            this.col = 0x000000;
        }
        console.log("on?", value);
        let scope = this;
        this.scene.traverse(function (child) {
            if(child.name.substr(0,4) == "page"){
                child.material.emissive.set(scope.col);
            }
        });
    }
    getMetaData() {
        return this.defaultAnimationValue;
    }
    setMetaData(dataStr){
        let values = dataStr.split(',');
        this.defaultAnimationValue = values[0];
    }

}

export default Lifetime8174
