import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class DecorCushion extends DecorObject {
    constructor() {
        super();
        this.defaultY = 0;
        this.metadata = '';
        this.classtype = "DecorCushion";
        this.YAXIS = new THREE.Vector3(1, 0, 0);
        this.cushion;
        this.defaultangle = 0;
        this.cushHeight = new THREE.Vector3();
        this.bounding;
        this.cHeight = 0.09;
        this.mixer;
        this.timescale = 36;
        this.totalDuration = 0;
        this.animationArray = [];
        this.currentAnimationFrame = 0;
        this.bbox = new THREE.Box3(); //for measuring selected items
        this.properties = [
            { title: 'animate', ui: 'slider', range: [0, 36], value: this.currentAnimationFrame},
            { title: 'flip', ui: 'toggle', icon: 'mirror.png' },
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
        this.properties = [
            { title: 'animate', ui: 'slider', range: [0, 36], value: this.currentAnimationFrame},
            { title: 'flip', ui: 'toggle', icon: 'mirror.png' },
            { title: 'remove', ui: 'alert_button' }
        ]
        this.signature.properties = this.properties;
    }
    loadedcallback() {
        
        // this.getVerts();
        let scope = this;
        this.scene.traverse(function (child) {

            if (child.isMesh) {
                console.log("CHILD", child.name);
                switch (child.name.substr(0,4)) {
                    case "cush":
                        scope.cushion = child;
                        break;
                    default:
                        break;

                }
            }
        })
        this.mixer = new THREE.AnimationMixer(this.scene);

        this.gltf.animations.forEach((clip) => {

            scope.mixer.clipAction(clip).play();
            scope.animationArray.push(clip);
            if (clip.duration > scope.totalDuration) {
                scope.totalDuration = clip.duration;
            }

        });


        this.setProperty("animate", this.currentAnimationFrame);

    }

    setProperty(prop, value) {
    
        switch (prop) {
            case "animate":
                let timeValue = Math.max((value / this.timescale * this.totalDuration) - 0.0001, 0);
                console.log(timeValue);
                this.mixer.setTime(timeValue);
                this.currentAnimationFrame = value;
                break;
            case "flip":
                this.cushion.rotateZ(Math.PI);

                break;
            default:
                break;
        }
        render();
    }

    getMetaData() {
        return this.currentAnimationFrame;
    }
    setMetaData(dataStr){
        this.currentAnimationFrame = Number(dataStr);
    }

}

export default DecorCushion
