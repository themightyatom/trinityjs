import * as THREE from '/three/build/three.module.js';


let loadedMaterialObjects = [];
let loadedMaterials = {};
let targetMat = null;

var MaterialManager = (function () {


    function applyMaterialProperty(property, value) {

        switch (property) {
            case "diffuse_map":
                var loader = new THREE.TextureLoader();
                function onLoad(texture) {
                    targetMat.map = texture;
                    texture.flipY = false;
                    texture.encoding = THREE.sRGBEncoding;
                    targetMat.needsUpdate = true;
                    targetMat.map.wrapS = THREE.RepeatWrapping;
                    targetMat.map.wrapT = THREE.RepeatWrapping;
                    render();
                }
                if (value == null) {
                    targetMat.map = null;
                    targetMat.needsUpdate = true;
                    render();
                } else {
                    loader.load(ltvs__source +"/textures/" + value, onLoad);
                }
                break;
            case "normal_map":
                var loader = new THREE.TextureLoader();
                function onnormLoad(texture) {
                    targetMat.normalMap = texture;
                    texture.flipY = false;
                    targetMat.normalMap.wrapS = THREE.RepeatWrapping;
                    targetMat.normalMap.wrapT = THREE.RepeatWrapping;
                    targetMat.needsUpdate = true;
                    render();
                }
                if (value == null) {
                    targetMat.normalMap = null;
                    targetMat.needsUpdate = true;
                    render();
                } else {
                    loader.load(ltvs__source +"/textures/" + value, onnormLoad);
                }

                break;
            case "normal_value":
                targetMat.normalScale = new THREE.Vector2(value, value);
                render();
                break;
            case "bump_map":
                var loader = new THREE.TextureLoader();
                function onbumpLoad(texture) {
                    targetMat.bumpMap = texture;
                    texture.flipY = false;
                    targetMat.bumpMap.wrapS = THREE.RepeatWrapping;
                    targetMat.bumpMap.wrapT = THREE.RepeatWrapping;
                    targetMat.needsUpdate = true;
                    render();
                }
                if (value == null) {
                    targetMat.bumpMap = null;
                    targetMat.needsUpdate = true;
                    render();
                } else {
                    loader.load(ltvs__source +"/textures/" + value, onbumpLoad);
                }
                break;
            case "bump_value":
                targetMat.bumpScale = value;
                render();
                break;
            case "color_hex":
                var hx = value.substr(1);
                targetMat.color.setHex('0x' + hx);
                render();
                break;
            case "emissive_hex":
                var hx = value.substr(1);
                targetMat.emissive.setHex('0x' + hx);
                render();
                break;
            case "opacity_value":
                targetMat.opacity = value;
                if (value == 1) {
                    targetMat.transparent = false;
                } else {
                    targetMat.transparent = true;
                }
                render();
                break;
            case "roughness_value":
                targetMat.roughness = value;
                render();
                break;
            case "metalness_value":
                targetMat.metalness = value;
                render();
                break;
            case "bump_map":
                var loader = new THREE.TextureLoader();
                function onmapLoad(texture) {
                    targetMat.bumpMap = texture;
                    texture.flipY = false;
                    targetMat.needsUpdate = true;
                    render();
                }
                loader.load(ltvs__source +"/textures/" + value, onmapLoad);
                break;
            case "bump_value":
                targetMat.bumpScale = value;
                render();
                break;

            default:
                break;
        }
        
    }
    function createMaterial(material) {
       

        targetMat = new THREE.MeshStandardMaterial();

        Object.entries(material).forEach(entry => {
            const [key, value] = entry;
            if (value != '') {
                applyMaterialProperty(key, value);
            }
        });
        targetMat.needsUpdate = true;
        return targetMat;

    }




    return {

       assignMaterial(target,id,key, extension) {
                if(loadedMaterials[id] != undefined) {
                    console.log("found material");
                    target.assignDefaultMaterial(loadedMaterials[id],key,extension);
                }else{
                fetch(ltvs__source + '/materials/' + id)
                    .then(response => response.json())
                    .then(data => {
                        let material = createMaterial(data);
                        target.assignDefaultMaterial(material,key,extension);
                        loadedMaterials[id] = material;
                        
                    });
                }

        },

        getMaterial(id, callback) {
            if(loadedMaterials[id] != undefined) {
                callback(loadedMaterials[id]);
            }else{
                fetch(ltvs__source + '/materials/' + id)
                .then(response => response.json())
                .then(data => {
                    let material = createMaterial(data);
                    loadedMaterials[id] = material;
                    callback(material);                  
                }); 
            }
        }


    }




})();


export default MaterialManager;