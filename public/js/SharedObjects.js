
import * as THREE from '/three/build/three.module.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
class SharedObjects {
    constructor() {

        this.wineObj;
        this.magObj;
        this.champsObj;
        this.halfbot;
        this.winebox;
        this.loadmanager = new THREE.LoadingManager();

        this.loadAssets();
    }
    loadAssets() {
        let scope = this;
        var loader = new GLTFLoader(this.loadmanager).setPath(ltvs__source + '/glb/');
        var model = "wine.glb";
        loader.load(model, function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    if (child.name == 'bot_new') {
                        // child.material = SharedMaterials.getMaterialFromID("bottle");
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                }
            });
            scope.wineObj = gltf.scene;
            scope.wineObj.classtype = "noHighlight";
        });


        var loader2 = new GLTFLoader(this.loadmanager).setPath(ltvs__source + '/glb/');
        model = "magnum.glb";
        loader2.load(model, function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    console.log("CHILD", child.name);
                    if (child.name == 'bot_new') {
                        // child.material = SharedMaterials.getMaterialFromID("bottle");
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                }
            });
            scope.magObj = gltf.scene;
        });

        var loader3 = new GLTFLoader(this.loadmanager).setPath(ltvs__source + '/glb/');
        model = "champbot.glb";

        loader3.load(model, function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    //child.material.envMap = vinlagringSharedMaterials.getEnvMap();
                    //child.material.transparent = false;
                }
            });
            scope.champs = gltf.scene;
        });

        var loader4 = new GLTFLoader(this.loadmanager).setPath(ltvs__source + '/glb/');
        model = "halfbot.glb";

        loader4.load(model, function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    if (child.name == 'bot_new') {
                        // child.material = SharedMaterials.getMaterialFromID("bottle");
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                }
            });
            scope.halfbot = gltf.scene;
        });

        var loader5 = new GLTFLoader(this.loadmanager).setPath(ltvs__source + '/glb/');
        model = "winebox.glb";

        loader5.load(model, function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    /* if (child.name == 'bot_new') {
                        // child.material = SharedMaterials.getMaterialFromID("bottle");
                         child.castShadow = true;
                         child.receiveShadow = true;
                     }*/
                }
            });
            scope.winebox = gltf.scene;
        });

    }

    /*
    */

    //var wbObjects = { wineObj: wineObj };

    // , Woodpinewbwinerex:pinewbwinerex



    getWine() {

        return new THREE.Object3D().copy(this.wineObj, true);
    }
    getMagnum() {

        return new THREE.Object3D().copy(this.magObj, true);
    }
    getChamps() {
        return new THREE.Object3D().copy(this.champs, true);
    }
    getHalf() {
        return new THREE.Object3D().copy(this.halfbot, true);
    }
    getWinebox() {
        return new THREE.Object3D().copy(this.winebox, true);
    }
    getBottle(snap) {
        switch (snap) {

            case "mag":
                return this.getMagnum();
                break;
            case "champ":
                return this.getChamps();
                break;
            case "bot":
                return this.getWine();
                break;
            case "half":
                return this.getHalf();
                break;
            case "winebox":
                return this.getWinebox();
                break;
            default:
                bot = "none";
                break;
        }
    }



}

export default SharedObjects;

