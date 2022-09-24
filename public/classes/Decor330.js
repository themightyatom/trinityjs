import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class Decor330 extends DecorObject {
    constructor() {
        super();
        this.metadata = '';
        this.classtype = "Decor330";
        this.XAXIS = new THREE.Vector3(1, 0, 0);
        this.bounding;
        this.cHeight = 0.09;
        this.mixer;
        this.timescale = 36;
        this.totalDuration = 0;
        this.animationArray = [];
        this.zeroHeight;
        this.top;
        this.table;
        this.zeroZ;
        this.properties = [
            { title: 'animate', ui: 'slider', range: [0, 36], value: 0,images:['down330.png','up330.png'] },
            { title:"tilt", ui:'slider', range:[0,45], value:0, images:['tilt_down.png','tilt_up.png']},
            { title:"drawer", ui:'slider', range:[0,30], value:0, images:['drawer_closed.png','drawer_open.png']},
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

        this.scene.traverse(function (child) {

            if (child.isMesh) {
                switch (child.name) {
                    case "top":
                        scope.top = child;
                        break;
                    case "table":
                        scope.table = child;
                        scope.zeroHeight = child.position.y;
                        break;
                    case "draw":
                        scope.drawer = child;
                        scope.zeroZ = child.position.z;
                    default:
                        break;

                }
            }
        })

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
                this.accessoryLayer.position.y = this.table.position.y - this.zeroHeight;
                break;
            case "tilt":
                let angle = value * (Math.PI/180);
                this.top.setRotationFromAxisAngle(this.XAXIS, angle );
                break;
            case "drawer":
                this.drawer.position.z = (value/100) + this.zeroZ;
            default:
                break;
        }
        render();
    }

}

export default Decor330
