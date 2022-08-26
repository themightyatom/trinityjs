import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class DecorAnimated extends DecorObject {
    constructor() {
        super();
        this.metadata = '';
        this.classtype = "DecorAnimated";
        this.YAXIS = new THREE.Vector3(1, 0, 0);
        this.bounding;
        this.cHeight = 0.09;
        this.mixer;
        this.timescale = 36;
        this.totalDuration = 0;
        this.animationArray = [];
        this.properties = [
            { title: 'animate', ui: 'slider', range: [0, 36], value: this.defaultopen },
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
                break;
            default:
                break;
        }
        render();
    }

}

export default DecorAnimated
