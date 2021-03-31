import * as THREE from '/three/build/three.module.js';
import DecorGroup from '/js/DecorGroup.js';
import DecorObject from '/js/DecorObject.js';
import { TWEEN } from '/js/tween.module.min.js';
import { USDZExporter } from '/three/examples/jsm/exporters/USDZExporter.js';
import { GLTFExporter } from '/three/examples/jsm/exporters/GLTFExporter.js';
import MaterialManager from '/js/MaterialManager.js';



var DecorManager = (function () {
    let camera;
    let controls;
    let mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let INTERSECTED;
    let targetLayer;
    let envLayer; // Environment layer, ignored for output
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
    let link = document.createElement('a');
    link.style.display = 'none';
    let mousemode = "none";
    document.body.appendChild(link);
    let autoCam = false;
    let cameraTween;
    let targetTween;
    let cameraTweenLength = 300;
    let accessoryTween;
    let accessoryRotTween;
    let lastLoadedModel = null;

    const checkMouseDown = function (event) {
        if (mousemode == 'placement') {
            event.preventDefault();
            mouse.x = (event.clientX / width3d) * 2 - 1;
            mouse.y = - (event.clientY / height3d) * 2 + 1;
            camera.updateMatrixWorld();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(availableSnaps, true);

            if (intersects.length > 0) {
                if (INTERSECTED != intersects[0].object) {
                    INTERSECTED = intersects[0].object;
                    console.log("intersected", INTERSECTED);
                    if (availableSnaps.includes(INTERSECTED)) {
                        console.log("do it");
                        if (autoCam) {
                            placeDecorObject(INTERSECTED);
                        } else {
                            removeAnyExisting(INTERSECTED);
                            animateDecorObject(INTERSECTED);
                        }

                        stopPlacement();
                    }
                }
            } else {

                INTERSECTED = null;
            }
        }
        render();
    }
    function stopPlacement() {
        focusGroup.turnOffSnapPoints();
        mousemode = 'none';
        INTERSECTED = null;
        if (autoCam) animateCamera(focusGroup);
    }



    function removeAnyExisting(target) {
        focusGroup.removeAccessoryAt(target);
    }

    function placeDecorObject(target) {
        endSpin();
        if (previewObj != null) {
            accessoryHolder.remove(previewObj);
            focusGroup.addMember(previewObj);
            focusGroup.add(previewObj);
            previewObj.applyMatrix4(target.matrixWorld);
            // adjustCamera(focusGroup);

            let list = buildPartList();
            createList(list);
        }

    }
    function animateDecorObject(target) {
        endSpin();
        if (previewObj != null) {
            accessoryHolder.remove(previewObj);
            target.decorObj.addAccessory(previewObj);
            previewObj.position.add(accessoryHolder.getWorldPosition());
            previewObj.position.sub(target.decorObj.getWorldPosition());
            previewObj.quaternion.copy(accessoryHolder.quaternion);
            accessoryTween = new TWEEN.Tween(previewObj.position).to(target.position, cameraTweenLength).start();
            accessoryRotTween = new TWEEN.Tween(previewObj.quaternion).to(target.quaternion, cameraTweenLength).start();
            let list = buildPartList();
            createList(list);
        }


    }
    function buildPartList() {
        //let list = {msg:'done'};
        let list = focusGroup.getMembers();
        return list;
    }
    function loadEnvironment(model) {
        //remove any previous environment
        envLayer.children.forEach(function (obj) {
            envLayer.remove(obj);
        });

        var env = new DecorObject();
        env.loadModel(model);
        envLayer.add(env);
        if (availableSnaps.length > 0) {
            env.position.copy(availableSnaps[0].position);
            stopPlacement();
        }

    }
    function showPreview(model, default_material, default_material_key, sku) {
        //remove any previous model
        console.log("in", model, default_material, default_material_key, sku);
        removePreview();


        previewObj = createModel(model, null, default_material, default_material_key, sku);
        accessoryHolder.add(previewObj);
        startSpin();
        console.log("camera", camera);
        mousemode = "placement";
        //if only one available snap point is available...
        if (availableSnaps.length == 1) {
            render();
            animateDecorObject(availableSnaps[0]);
            stopPlacement();
        }
    }
    function removePreview() {
        accessoryHolder.children.forEach(function (obj) {
            obj.parent.remove(obj);
        })
    }
    function showExtremities() {
        //turn off all but the first and last snap points
        let maxX = -Infinity;
        let minX = Infinity;
        let maxSnap, minSnap;
        let extremes = [];
        availableSnaps.forEach(function (snap) {
            let worldPos = new THREE.Vector3();
            snap.getWorldPosition(worldPos);
            if (worldPos.x > maxX) {
                maxSnap = snap;
                maxX = worldPos.x;
            }
            if (worldPos.x < minX) {
                minSnap = snap;
                minX = worldPos.x;
            }
        });

        availableSnaps.forEach(function (snap) {
            if (snap != maxSnap && snap != minSnap) {
                snap.visible = false;
            }
        })
        extremes.push(maxSnap, minSnap);
        availableSnaps = extremes;
        render();
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
                target.decorObj.addAccessory(objcopy);
                objcopy.applyMatrix4(target.matrix);
            });
        });
        focusGroup.turnOffSnapPoints();
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
        let zdim = Math.max(size.x, size.y) * 1.1;
        camera.position.z = Math.max(1, zdim);
        camera.updateProjectionMatrix();
        render();
        camera.updateProjectionMatrix();
        controls.update();
        render();
        setTimeout(render, 30);
    }
    function animateCamera(target) {
        console.log("Setting camera", target);
        let boundingBox = new THREE.Box3().setFromObject(target);
        let size = new THREE.Vector3();
        boundingBox.getSize(size) // Returns Vector3
        let controlDestination = new THREE.Vector3();
        let cameraDestination = new THREE.Vector3();
        boundingBox.getCenter(controlDestination);

        cameraDestination.y = size.y / 2;
        cameraDestination.x = controlDestination.x;
        let zdim = Math.max(size.x, size.y) * 1.1;
        cameraDestination.z = Math.max(1, zdim);

        cameraTween = new TWEEN.Tween(camera.position).to(cameraDestination, cameraTweenLength);
        cameraTween.onUpdate(function () { controls.update() });
        cameraTween.easing(TWEEN.Easing.Sinusoidal.InOut);
        cameraTween.start();
        targetTween = new TWEEN.Tween(controls.target).to(controlDestination, cameraTweenLength).start();
        /* camera.updateProjectionMatrix();
         render();
         camera.updateProjectionMatrix();
         controls.update();
         render();
         setTimeout(render, 30);*/
    }

    async function exportAR() {

        const exporter = new USDZExporter();
        const arraybuffer = await exporter.parse(focusGroup);
        const blob = new Blob([arraybuffer], { type: 'application/octet-stream' });
        let filename = focusGroup.name + '.usdz';
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.usdz';
        link.click();

    }
    function exportSingle() {

        var exporter = new GLTFExporter();
        //var target = furnitureLayer;
        var target = focusGroup;
        render();
        var filename = 'model';
        if (focusGroup.name != undefined) {
            filename = focusGroup.name;
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
    function createModel(model, cb, default_material, default_material_key, sku) {
        var prev = new DecorObject();

        //if a default material is specified, create or get from cache
        if (default_material.length > 0 && default_material_key.length == 4) {
            MaterialManager.assignMaterial(prev, default_material, default_material_key);
        } else {
            if (default_material.length < 1) { console.warn("Material parameters are missing") };
            if (default_material_key.length != 4) { console.warn("Material key (target) should be 4 characters") };
        }
        prev.loadModel(model, cb, sku);
        return prev;
    }

    return {

        addGroup: function (model, default_material, default_material_key, sku) {
            let decorGrp = new DecorGroup();
            decorGrp.name = model + "_group";
            targetLayer.add(decorGrp);
            //decorObj.updateMatrixWorld();
            var callback = function () { adjustCamera(decorGrp) };
            if (model) {
                let decorObj = createModel(model, callback, default_material, default_material_key, sku);
                decorGrp.addMember(decorObj);
                decorGrp.add(decorObj);
                lastLoadedModel = decorObj;
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
        setEnvLayer: function (layer) {
            envLayer = layer;
        },
        setControls: function (cont) {
            controls = cont;
        },
        setTargetWindow: function (container) {
            targetWindow = container;
            targetWindow.addEventListener('pointerdown', checkMouseDown, false);

        },
        addAccessory: function (snap, model, sku, snap_type, default_material, default_material_key) {
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
                    autoCam = false;
                    showPreview(model, default_material, default_material_key, sku);
                    render();
                    break;
                // Add to any member of group
                case 'environment':
                    autoCam = false;
                    //special type, not part of the model to be saved.
                    loadEnvironment(model);
                    break;
                case 'extreme':
                    autoCam = true;
                    //turn off all but the extremities 
                    showExtremities();
                    showPreview(model, default_material, default_material_key, sku);
                    break;
                default:
                    autoCam = false;
                    showPreview(model, default_material, default_material_key, sku);
                    render();
                    break;
            }
            console.log("Adding", snap, model, sku, snap_type, default_material, default_material_key);
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
                texture.encoding = THREE.sRGBEncoding;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                mat.map = texture;
            }
            mat.color.set(material.color_hex);
            focusGroup.changeMaterial(key, mat);
        },
        createAR() {
            exportAR();
            console.log("Create");
            // exportSingle();
        },
        clearPreview() {
            removePreview();
        },
        assignMaterial(material, key) {
            MaterialManager.assignMaterial(lastLoadedModel, material, key);
        },
        removeItem(item) {
            return focusGroup.removeItem(item);
        }

    }

})();

export default DecorManager;


