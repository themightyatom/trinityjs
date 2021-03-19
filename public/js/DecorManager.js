import * as THREE from '/three/build/three.module.js';
import DecorGroup from '/js/DecorGroup.js';
import DecorObject from '/js/DecorObject.js';
import { TWEEN } from '/js/tween.module.min.js';
import { USDZExporter } from '/three/examples/jsm/exporters/USDZExporter.js';



var DecorManager = (function () {
    let camera;
    let controls;
    let mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let INTERSECTED;
    let targetLayer;
    let targetWindow;
    let width3d, height3d;
    let availableSnaps = [];
    let modelToLoad = '';
    let decorGroups = [];
    let spinnerTween = null;
    let accessoryHolder = new THREE.Object3D();;
    let rotationAngle = 0;
    const YAXIS = new THREE.Vector3(0, 1, 0);
    let previewObj = null;
    let focusGroup = null;

    const checkMouseDown = function (event) {
        event.preventDefault();
        mouse.x = (event.clientX / width3d) * 2 - 1;
        mouse.y = - (event.clientY / height3d) * 2 + 1;
        camera.updateMatrixWorld();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(targetLayer.children, true);

        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object) {
                INTERSECTED = intersects[0].object;
                console.log("intersected", INTERSECTED);
                if (availableSnaps.includes(INTERSECTED)) {
                    console.log("do it");
                    placeDecorObject(INTERSECTED);
                }
            }
        } else {
            if (INTERSECTED) INTERSECTED.material.opacity = INTERSECTED.currentOpacity;
            INTERSECTED = null;
        }
        render();
    }

    function placeDecorObject(target) {
        if (previewObj != null) {
            accessoryHolder.remove(previewObj);
            focusGroup.addMember(previewObj);
            previewObj.applyMatrix4(target.matrixWorld);
            adjustCamera(focusGroup);
        }
        endSpin();
    }

    function showPreview(model) {
        var prev = new DecorObject();
        prev.loadModel(model);
        previewObj = prev;
        accessoryHolder.add(prev);
        startSpin();
        console.log("camera", camera);
    }
    function animate(time) {
        window.requestAnimationFrame(animate);
        TWEEN.update(time);

    }

    function startSpin() {

        rotationAngle = 0;
        if (spinnerTween == null) {
            spinnerTween = new TWEEN.Tween();
        }
        spinnerTween.repeat(Infinity);
        spinnerTween.onUpdate(function () {
            spinItem();
            render();
        });

        spinnerTween.start();

    }
    function spinItem() {
        rotationAngle += 1;
        accessoryHolder.quaternion.setFromAxisAngle(YAXIS, rotationAngle * Math.PI / 180);
    }
    const endSpin = function () {
        spinnerTween.stop();
    }
    animate();


    function replicate(targets, decorObj) {
        var base = new DecorObject();
        base.name = decorObj;
        var objcopy;
        base.loadModel(decorObj, function () {
            console.log("finish", targets);
            targets.forEach(function (target) {
                objcopy = new THREE.Object3D();
                objcopy.copy(base, true);
                target.accessoryLayer.add(objcopy);
                objcopy.applyMatrix4(target.matrix);
            });
        });
        render();
    }
    function adjustCamera(target) {
        console.log("Setting camera", target);
        let boundingBox = new THREE.Box3().setFromObject(target);
        let size = new THREE.Vector3();
        boundingBox.getSize(size) // Returns Vector3
        boundingBox.getCenter(controls.target);
        camera.position.y = size.y / 2;
        camera.position.x = target.position.x;
        let zdim = Math.max(size.x, size.y) * 2;
        camera.position.z = Math.max(2, zdim);
        camera.updateProjectionMatrix();
        render();
        camera.updateProjectionMatrix();
        controls.update();
        render();
        setTimeout(render, 30);
    }
    async function exportAR() {

        const exporter = new USDZExporter();
        const arraybuffer = await exporter.parse(focusGroup);
        const blob = new Blob([arraybuffer], { type: 'application/octet-stream' });

        const link = document.getElementById('arlink');
        link.href = URL.createObjectURL(blob);

    }
    function exportSingle() {

        var exporter = new THREE.GLTFExporter();
        //var target = furnitureLayer;
        var target = focusGroup;
        render();
        var filename = 'model';
        if (productid != undefined) {
            filename = productid;
        }
        if(defaultFinish && defaultFinish.length > 1){
            filename = filename + "-" + defaultFinish.substr(4);
        }
    
    
        if (target != null) {
            exporter.parse(target, function (result) {
    
                saveArrayBuffer(result, filename + '.glb');
                // forceIndices: true, forcePowerOfTwoTextures: true
                // to allow compatibility with facebook
            }, { binary: true, forceIndices: false, forcePowerOfTwoTextures: true });
        }
    }
    
    
    function saveArrayBuffer(buffer, filename) {
    
        saveFile(new Blob([buffer], { type: 'application/octet-stream' }), filename);
    
    }
    function saveFile(blob, filename) {
    
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.click();
    
        // URL.revokeObjectURL( url ); breaks Firefox...
    }

    return {

        addGroup: function (model, cb, matrix) {
            let decorGrp = new DecorGroup();
            decorGrp.name = model + "_group";
            targetLayer.add(decorGrp);
            //decorObj.updateMatrixWorld();
            var callback = function () { adjustCamera(decorGrp) };
            if (model) {
                decorGrp.addModel(model, callback, matrix);
            }
            decorGroups.push(decorGrp);
            focusGroup = decorGrp;
        },
        setCamera: function (camera3d) {
            camera = camera3d;
            camera.add(accessoryHolder);
            accessoryHolder.position.z = -2;
            accessoryHolder.position.y = 0.5;
        },
        setTargetLayer: function (layer) {
            targetLayer = layer;
        },
        setControls: function (cont) {
            controls = cont;
        },
        setTargetWindow: function (container) {
            targetWindow = container;
            targetWindow.addEventListener('pointerdown', checkMouseDown, false);
        },
        addAccessory: function (snap, model, sku, snap_type) {
            modelToLoad = model;
            availableSnaps = [];
            decorGroups.forEach(function (decorGr) {
                // returns number of snaps available
                var s = decorGr.turnOnSnapPoints(snap);
                availableSnaps = availableSnaps.concat(s);
                console.log("Obj snaps", s);
            });

            switch (snap_type) {

                // Apply to all snap points 
                case 'all':
                    replicate(availableSnaps, model);
                    break;
                // Add to group, not member of group
                case 'single':

                    //are there multiple points available? If not, place immmediately
                    console.log("snaps", availableSnaps);
                    if (availableSnaps.length > 1) {

                    } else {

                    }
                    showPreview(model);
                    render();
                    break;
                // Add to any member of group
                default:

                    //are there multiple points available? If not, place immmediately
                    console.log("snaps", availableSnaps);
                    if (availableSnaps.length > 1) {

                    } else {

                    }
                    showPreview(model);
                    render();
                    break;
            }
            console.log("Adding", snap, model, sku, snap_type);
        },

        setWindowSize(w, h) {
            width3d = w;
            height3d = h;
        },
        update() {
            if (TWEEN) {
                TWEEN.update();
            }
        },
        changeMaterial(key, material) {
            //create material, to use same instance everywhere 
            var mat = new THREE.MeshStandardMaterial({ roughness: material.roughness_value, metalness: material.metalness_value });
            if (material.diffuse_map.length > 3) {
                let texture = new THREE.TextureLoader().load('/textures/' + material.diffuse_map, function () { render(); });
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                mat.map = texture;
            }
            mat.color.set(material.color_hex);
            focusGroup.changeMaterial(key, mat);
        },
        createAR(){
            //exportAR();
            console.log("Create");
            exportSingle();
        },
    }

})();

export default DecorManager;


