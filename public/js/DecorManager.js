import * as THREE from '/three/build/three.module.js';
import DecorGroup from '/js/DecorGroup.js';
//import DecorObject from '/js/DecorObject.js';
import DecorObject from '/classes/DecorObject.js'
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
    accessoryHolder.castShadow = false;
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
    let lastLoadedGroup= null;
    let wp = new THREE.Vector3();
    let duplicationModel;
    let handles;
    let unloadedDefaultAccessories = [];
    let masterDefaultMaterial;
    let masterDefaultKey;
    let defaultAllAccessory = null;
    let firsttime = true;
    let defaultAccessorySkus = [];
    let choosenFinish = '';

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
                    if (availableSnaps.includes(INTERSECTED)) {
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

    const loadScript = src => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.type = 'module';
          script.onload = resolve
          script.onerror = reject
          script.src = src
          document.head.append(script)
        })
      }



    function removeAnyExisting(target) {

        console.log("REMOVING-.-.", target);
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
            assignDefaultAllAccessory();
            buildPartList();

        }
        /*let exclude = previewObj.exclude;
        if(exclude.length > 0){
            let exclusionArray = exclude.split(',');
             exclusionArray.forEach(function(snapid){removeSnapType(snapid)});
         }*/

    }
    function animateDecorObject(target) {
        endSpin();
        if (previewObj != null) {
            accessoryHolder.remove(previewObj);
            target.decorObj.addAccessory(previewObj);
            previewObj.position.add(accessoryHolder.getWorldPosition(wp));
            previewObj.position.sub(target.decorObj.getWorldPosition(wp));
            previewObj.quaternion.copy(accessoryHolder.quaternion);
            accessoryTween = new TWEEN.Tween(previewObj.position).to(target.position, cameraTweenLength).start();
            accessoryRotTween = new TWEEN.Tween(previewObj.quaternion).to(target.quaternion, cameraTweenLength).start();
           /* let exclude = previewObj.exclude;
            if(exclude.length > 0){
                let exclusionArray = exclude.split(',');
                 exclusionArray.forEach(function(snapid){removeSnapType(snapid)});
             }*/
            assignDefaultAllAccessory();
            buildPartList();

        }
    }
    function placeDirect(target) {
        endSpin();
        if (previewObj != null) {
            accessoryHolder.remove(previewObj);
            previewObj.applyMatrix4(target.matrix);
            target.decorObj.addAccessory(previewObj);

            // adjustCamera(focusGroup);
            assignDefaultAllAccessory();
            buildPartList();

        }
    }
    function buildPartList(checkmenu = true) {
        //let list = {msg:'done'};
        let list = focusGroup.getMembers();
        if (createList) {
            createList(list,defaultAccessorySkus,choosenFinish, checkmenu);
        }
    }
    function loadEnvironment(model) {
        //remove any previous environment
        envLayer.children.forEach(function (obj) {
            envLayer.remove(obj);
        });

        var env = new DecorObject();
        env.loadModel('env', model);
        env.name = model;
        envLayer.add(env);
        if (availableSnaps.length > 0) {
            env.position.copy(availableSnaps[0].position);
            stopPlacement();
        }

    }
    function showPreview(obj) {
        //remove any previous model
        removePreview();
        if (availableSnaps.length < 1) { return };

        obj.cb = null;
        previewObj = createModel(obj);
        accessoryHolder.add(previewObj);
        lastLoadedModel = previewObj;
        startSpin();
        mousemode = "placement";
        //if only one available snap point is available...
        if (availableSnaps.length == 1 && obj.autoplace) {
            render();
            removeAnyExisting(availableSnaps[0]);
            placeDirect(availableSnaps[0]);
            if(obj.include.length > 0){
                console.log("INCLUDE", obj.include);
                addInclude(obj.include);
            }
            // animateDecorObject(availableSnaps[0]);
            stopPlacement();
        }
    }
    function addInclude(sku){
        //check if already included
        let included = false;
        focusGroup.getMembers().forEach(function(m){
            if(m.sku == sku) included = true;
            console.log("sku", m.sku);
            m.getAccessories().forEach(function(a){
                console.log("SKU", a.sku, sku)
                if(a.sku == sku) included = true;
            });
        });
        if(included) return;
        //get model from server
        fetch('/clients/' + sku)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let params = data.params;
            addAccessory(params.id, params.snap, params.model, params.sku, params.snap_type, params.exclude, params.include, params.default_material, params.default_material_key);
        });


    }
    function assignDefaultAllAccessory() {
        if (!defaultAllAccessory) return;
        let snappoints = lastLoadedModel.turnOnSnapPoints(defaultAllAccessory.snap);
        replicate(snappoints, defaultAllAccessory);
        
    }
    function removePreview() {
        accessoryHolder.children.forEach(function (obj) {
            obj.parent.remove(obj);
        })
    }
    function showExtremities() {
        //turn off occupied snap points 
        console.log("looking for extremes");
        let extremes = [];
        let boxes = focusGroup.drawBoundings('wood', false);
        console.log("BOXES", boxes);
        let box = new THREE.Box3();
        let occupied = false;
        availableSnaps.forEach(function (snap) {
        occupied = false;
           box.setFromObject(snap);
           boxes.forEach(function(b){
            if(box.containsPoint(b.getCenter()) || b.containsPoint(box.getCenter()) ){
                    occupied = true;
                }
           });
            if(occupied){
               snap.visible = false;
            }else{
                extremes.push(snap);
            }
            
        });
        console.log("extremes", extremes);
        availableSnaps = extremes;
        render();
    }
    function weedSnaps(exclude,snap){
        let unoccupied = [];
        let boxes = focusGroup.drawOccupieds(exclude,snap, false);
        let occupied = false;
        let box = new THREE.Box3();
        availableSnaps.forEach(function (snapitem) {
        occupied = false;
           box.setFromObject(snapitem);
           boxes.forEach(function(b){
            if(box.containsPoint(b.getCenter()) || b.containsPoint(box.getCenter()) ){
                    occupied = true;
                }
           });
            if(occupied){
               snapitem.visible = false;
            }else{
                unoccupied.push(snapitem);
            }
            
        });
        availableSnaps = unoccupied;
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


    function replicate(targets, obj) {
        defaultAllAccessory = obj;
        targets.forEach(function (targ) {
            let base = createModel(obj);
            base.position.copy(targ.position);
            targ.decorObj.addAccessory(base);
            if(!obj.model.includes('.fixed')) base.quaternion.copy(targ.quaternion);

        });
        handles = targets;
        duplicationModel = obj.model; //Save for new models 
        focusGroup.turnOffSnapPoints();
        buildPartList(false); //don't redraw the menu system, nothing can be added

        render();
    }
    function loadSecondTierAccessories() {

        for (var i = 0; i < unloadedDefaultAccessories.length; i++) {
            let acc = unloadedDefaultAccessories[i];
            let any = addAccessory(acc.id, acc.snap, acc.model, acc.sku, acc.snap_type, acc.exclude, acc.default_material, acc.default_material_key, true);
            if (any < 1) {
                //run again
                setTimeout(loadSecondTierAccessories, 1000);
            } else {
                unloadedDefaultAccessories.splice(i, 1);
            }
        };
    }
    function adjustCamera(target) {
        if (firsttime) { firsttime = false; return; };
        render();
        let boundingBox = new THREE.Box3().setFromObject(target);
        let size = new THREE.Vector3();
        boundingBox.getSize(size) // Returns Vector3
        boundingBox.getCenter(controls.target);
        camera.position.y = size.y / 2;
        camera.position.x = target.position.x;
        let zdim = Math.max(size.x, size.y) * 1.5;
        camera.position.z = Math.max(1, zdim);
        camera.updateProjectionMatrix();


        controls.update();
        render();

    }
    function animateCamera(target, speed = null) {
        let boundingBox = new THREE.Box3().setFromObject(target);
        let size = new THREE.Vector3();

        boundingBox.getSize(size) // Returns Vector3
        console.log("size", size);
        let controlDestination = new THREE.Vector3();
        let cameraDestination = new THREE.Vector3();
        boundingBox.getCenter(controlDestination);

        cameraDestination.y = (size.y / 2) + 0.7;
        cameraDestination.x = controlDestination.x - 0.7;
        let zdim = Math.max(size.x, size.y) * 1.5;
        cameraDestination.z = Math.max(1, zdim);
        let cameraSpeed;
        if (speed != null) {
            cameraSpeed = speed;
        } else {
            cameraSpeed = cameraTweenLength;
        }

        cameraTween = new TWEEN.Tween(camera.position).to(cameraDestination, cameraSpeed);
        cameraTween.onUpdate(function () { controls.update(); });
        cameraTween.easing(TWEEN.Easing.Sinusoidal.InOut);
        cameraTween.onComplete(function () { scene.fog = null; });
        cameraTween.start();
        targetTween = new TWEEN.Tween(controls.target).to(controlDestination, cameraSpeed).start();

    }

    async function exportAR() {
        alert("ready for ar!");
        const exporter = new USDZExporter();
        const arraybuffer = await exporter.parse(focusGroup);
        const blob = new Blob([arraybuffer], { type: 'application/octet-stream' });
        let filename = focusGroup.name + '.usdz';
       /* link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.usdz';
        link.click();*/
        const ioslink = document.getElementById( 'ioslink' );
		ioslink.href = URL.createObjectURL( blob );
       

    }
    function exportSingle() {

        var exporter = new GLTFExporter();
        //var target = furnitureLayer;
        var target = focusGroup;
        render();
        var filename = 'model';
        if (focusGroup.name != undefined) {
            filename = focusGroup.name.substr(0,focusGroup.name.indexOf('.'));
        }


        if (target != null) {
            exporter.parse(target, function (result) {

                saveArrayBuffer(result, filename + '.glb');
                // forceIndices: true, forcePowerOfTwoTextures: true
                // to allow compatibility with facebook
            }, { binary: true, forceIndices: false, forcePowerOfTwoTextures: true, onlyVisible: false });
        }
       // <a href="intent://arvr.google.com/scene-viewer/1.0?file=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;">Avocado</a>;
    }


    function saveArrayBuffer(buffer, filename) {

        saveFile(new Blob([buffer], { type: 'application/octet-stream' }), filename);

    }
    function saveFile(blob, filename) {
       // link.href = "intent://arvr.google.com/scene-viewer/1.0?file=" + URL.createObjectURL(blob) + "&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;"
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...
    }

    function createModel(obj) {
        var prev = new DecorObject();
        if (obj.default_material_key == masterDefaultKey) {
            obj.default_material = masterDefaultMaterial;
        }

        //if a default material is specified, create or get from cache
        if (String(obj.default_material).length > 0 && obj.default_material_key.length == 4) {
            MaterialManager.assignMaterial(prev, obj.default_material, obj.default_material_key, choosenFinish);
        }
        prev.loadModel(obj.id, obj.model,obj.sku,obj.cb);
        prev.isGroupMember = obj.isGroupMember;
        prev.snap = obj.snap;
        prev.snap_type = obj.snap_type;
        prev.exclude = obj.exclude;
        return prev;
    }
    function applyDefaultMaterial() {
        changeMaterial(masterDefaultKey, masterDefaultMaterial, choosenFinish);
    }
    function firstZoom() {
        dev__hidespinner();
        animateCamera(lastLoadedGroup, 1000);
    }
    function removeSnapType(snaptype){
        console.log("removing", snaptype);
        //get the snap points of this type
        let sps = focusGroup.turnOnSnapPoints(snaptype);
        sps.forEach(function(sp){
            focusGroup.removeAccessoryAt(sp);
        })
    }
    


    return {

        addGroup: function (id, model, default_material, default_material_key, sku, default_accessories = [], snap = '') {
            let decorGrp = new DecorGroup();
            decorGrp.name = model + "_group";
            targetLayer.add(decorGrp);
            //decorObj.updateMatrixWorld();
            //keep the finish extension as default
            let ext = sku.lastIndexOf('-')
            if(ext){
                choosenFinish = sku.substr(ext+1);
                console.log("EXTENSION", choosenFinish);
                
            }
            masterDefaultMaterial = default_material;
            console.log("DEFAULT MAT", default_material);
            masterDefaultKey = default_material_key;
            var callback = function () {
                render();
                adjustCamera(decorGrp);
                defaultAccessorySkus = ['6101C', '610C'];
                default_accessories.forEach(function (acc) {
                    let any = addAccessory(acc.id, acc.snap, acc.model, acc.sku, acc.snap_type, acc.exclude, acc.default_material, acc.default_material_key, true);
                    if (any < 1 && acc.snap != 'env') {
                        unloadedDefaultAccessories.push(acc);
                        setTimeout(loadSecondTierAccessories, 500);
                    }
                    defaultAccessorySkus.push(acc.sku); // included in main SKU, don't add to basket
                });
                setTimeout(applyDefaultMaterial, 1000);
            };
            if (model) {
                let decorObj = createModel({id, model, default_material, default_material_key, sku, snap, isGroupMember:true, cb:callback});
                decorGrp.addMember(decorObj);
                decorGrp.add(decorObj);
                lastLoadedModel = decorObj;
            }
            decorGroups.push(decorGrp);
            focusGroup = decorGrp;
            lastLoadedGroup = decorGrp;
            if (default_accessories.length < 1) {
                buildPartList();

            }

            setTimeout(firstZoom, 1000);

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
        addAccessory: function (id, snap, model, sku, snap_type, exclude, include, default_material, default_material_key, isGroupMember = false) {
            modelToLoad = model;
            availableSnaps = [];
            console.log("snap", snap);
            decorGroups.forEach(function (decorGr) {
                // returns number of snaps available
                var s = decorGr.turnOnSnapPoints(snap);
                availableSnaps = availableSnaps.concat(s);
            });

            weedSnaps(exclude, snap);

            let obj;

            switch (snap_type) {

                // Apply to all snap points 
                case 'all':
                    //don't change if already assigned
                    if(defaultAllAccessory){
                        focusGroup.getMembers().forEach(function(obj){obj.removeBySKU(defaultAllAccessory.sku)});
                    }
                    replicate(availableSnaps, {id, model, sku, snap_type, default_material, default_material_key, snap});
                    break;
                // Add to group, not member of group
                case 'single':
                    autoCam = false;
                    obj = {id, model, default_material, default_material_key, sku, snap, exclude, include, isGroupMember, snap_type};
                    obj.autoplace = true;
                    showPreview(obj);
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
                    
                    obj = {id, model, sku, snap, exclude, isGroupMember};
                    obj.default_material = masterDefaultMaterial;
                    obj.default_material_key = masterDefaultKey;
                    obj.autoplace = false;
                    showPreview(obj);
                    break;
                case 'entity': //entity is a separteModel (not accessory) to become part of the group, but with allocated position from snap point
                    obj = {id, model, default_material, default_material_key, sku, snap, exclude, include, isGroupMember};
                    obj.cb = null;
                    let decorObj = createModel(obj);
                    decorObj.position.copy(availableSnaps[0].position);
                    focusGroup.addMember(decorObj);
                    focusGroup.add(decorObj);
                    //lastLoadedModel = decorObj;
                    break;
                default:
                    autoCam = false;
                    obj = {id, model, default_material, default_material_key, sku, snap, snap_type, exclude, include, isGroupMember};
                    obj.autoplace = true;
                    showPreview(obj);
                    render();
                    break;
            }
            return availableSnaps.length;
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
        changeMaterial(key, material, extension) {
            console.log("master cheanging", key, extension);
            MaterialManager.getMaterial(material, function (mat) {
                focusGroup.changeMaterial(key, mat, extension);
            });
            masterDefaultMaterial = material;
            choosenFinish = extension;
            buildPartList(true);
        },
        createAR() {
            console.log("Choosing...");
            if(/iPhone|iPad/i.test(navigator.userAgent)){ 
                exportAR();
                return;
            };
            if(/Android/i.test(navigator.userAgent)){ 
                exportSingle();
                return;
            }
            exportAR();
        },
        clearPreview() {
            removePreview();
        },
        assignMaterial(material, key, extension) {
            // MaterialManager.assignMaterial(lastLoadedModel, material, key);
            changeMaterial(key, material, extension);
        },
        removeItem(item) {
            return focusGroup.removeItem(item);
        },
        removeBySKU(sku) {
            focusGroup.getMembers().forEach(function(obj){obj.removeBySKU(sku)});
            defaultAllAccessory = null;
            buildPartList();
        },
        exportGLB(){
            exportSingle();
        },
        mirrorGroup() {
            focusGroup.mirrorGroup();
        },
        reset() {
            while (targetLayer.children.length > 0) {
                targetLayer.remove(targetLayer.children[0]);
            }
            while (envLayer.children.length > 0) {

                envLayer.remove(envLayer.children[0]);
            }
            while (accessoryHolder.children.length > 0) {
                accessoryHolder.remove(accessoryHolder.children[0]);
            }
            focusGroup = null;
            unloadedDefaultAccessories = [];
            decorGroups = [];
        }

    }

})();

export default DecorManager;


