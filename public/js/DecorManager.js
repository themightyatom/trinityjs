import * as THREE from '/three/build/three.module.js';
//import DecorObject from '/js/DecorObject.js';
import DecorObject from '/classes/DecorObject.js'
//import SquareRoom from '/classes/SquareRoom.js'
//import SlantRoom from '/classes/SlantRoom.js'
//import DecorWindow from '/classes/DecorWindow.js'
//import DecorDoor from '/classes/DecorDoor.js'
import { TWEEN } from '/js/tween.module.min.js';
import { USDZExporter } from '/three/examples/jsm/exporters/USDZExporter.js';
import { DecorGLTFExporter } from '/js/DecorGLTFExporter.js';
import MaterialManager from '/js/MaterialManager.js';
import { DecorDragControls } from '/js/DecorDragControls.js';
import DecorIO from '/js/DecorIO.js';
//import * as fflate from '/three/examples/jsm//libs/fflate.module.js';












class DecorManager {
    constructor(decor3d) {
        this.decor3d = decor3d;


        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.params.Line.threshold = 0.0;
        this.raycaster.params.Points.threshold = 0.0;
        this.raycaster.params.Mesh.threshold = 0.0;
        this.INTERSECTED;
        /* let targetLayer;
         let envLayer; // Environment layer, ignored for output
         let targetWindow;
         let width3d, height3d;*/
        this.availableSnaps = [];
        this.modelToLoad = '';
        this.decorGroups = [];
        this.spinnerTween = null;
        this.accessoryHolder = new THREE.Object3D();
        this.accessoryHolder.castShadow = false;
        this.rotationAngle = 0;
        this.YAXIS = new THREE.Vector3(0, 1, 0);
        this.previewObj = null;
        this.focusGroup = null;
        this.link = document.createElement('a');
        this.link.style.display = 'none';
        this.mousemode = "none";
        document.body.appendChild(this.link);
        this.autoCam = false;
        this.cameraTween;
        this.targetTween;
        this.cameraTweenLength = 300;
        this.accessoryTween;
        this.accessoryRotTween;
        this.lastLoadedModel = null;
        this.lastLoadedGroup = null;
        this.wp = new THREE.Vector3();
        this.duplicationModel;
        this.handles;
        this.unloadedDefaultAccessories = [];
        this.masterDefaultMaterial = null;
        this.masterDefaultKey = null;
        this.masterSKU;
        this.defaultAllAccessory = null;
        this.firsttime = true;
        this.defaultAccessorySkus = ['6101C', '610C'];//never to be shown in parts list
        this.choosenFinish = '';
        this.dynamicClass;
        this.dragControls = null;
        this.focusPlane = null;
        this.placeEntity = false;
        const decorIO = new DecorIO();
        this.defaultArray = [];
        this.aniReq = null;
        this.setCamera();
        this.decor3d.renderer.domElement.addEventListener('pointerdown', this.checkMouseDown.bind(this), false);

        this.accessoryQueueLength = 0;

    }

    checkMouseDown(event) {
        if (this.mousemode == 'placement') {
            event.preventDefault();
            this.mouse.x = (event.clientX / this.decor3d.width3d) * 2 - 1;
            this.mouse.y = - (event.clientY / this.decor3d.height3d) * 2 + 1;
            this.decor3d.camera.updateMatrixWorld();
            this.raycaster.setFromCamera(this.mouse, this.decor3d.camera);

            const intersects = this.raycaster.intersectObjects(this.availableSnaps, true);

            if (intersects.length > 0) {
                if (this.INTERSECTED != intersects[0].object) {
                    this.INTERSECTED = intersects[0].object;
                    if (this.availableSnaps.includes(this.INTERSECTED)) {
                        if (this.placeEntity) {
                            if (this.INTERSECTED.isPlane) {
                                this.beginDrag(this.INTERSECTED, intersects[0].face, intersects[0].point);
                            } else {
                                this.placeDecorObject(this.INTERSECTED);
                            }
                        } else {
                            if (this.INTERSECTED.isPlane) {
                                this.beginDrag(this.INTERSECTED, intersects[0].face, intersects[0].point);
                            } else {
                                this.removeAnyExisting(this.INTERSECTED);
                                this.animateDecorObject(this.INTERSECTED);
                                //this.placeDecorObject(this.INTERSECTED);
                            }
                        }

                        this.stopPlacement();
                    }
                }
            } else {

                this.INTERSECTED = null;
            }
        }
        render();
    }
    disable() {
        this.decor3d.renderer.domElement.removeEventListener('pointerdown', this.checkMouseDown.bind(this));
    }
    enable() {
        this.decor3d.renderer.domElement.addEventListener('pointerdown', this.checkMouseDown.bind(this), false);
    }
    stopPlacement() {
        this.focusGroup.turnOffSnapPoints();
        this.mousemode = 'none';

        this.INTERSECTED = null;
        if (this.autoCam) this.animateCamera(this.focusGroup);

    }





    removeAnyExisting(target) {


        this.focusGroup.removeAccessoryAt(target);
    }

    placeDecorObject(target) {
        this.endSpin();
        if (this.previewObj != null) {
            this.accessoryHolder.remove(this.previewObj);
            //group may not be at world center.
            this.focusGroup.updateMatrixWorld();
            let tempMatrix = new THREE.Matrix4().copy(this.focusGroup.matrix);

            //move to center and remove rotation temporarily.
            this.focusGroup.position.x = this.focusGroup.position.y = this.focusGroup.position.z = 0;
            this.focusGroup.quaternion.copy(new THREE.Quaternion());
            this.focusGroup.updateMatrixWorld();
            this.focusGroup.addAccessory(this.previewObj);
            //this.focusGroup.add(this.previewObj);
            this.previewObj.applyMatrix4(target.matrixWorld);
            //MOve back to position and rotation
            this.focusGroup.applyMatrix4(tempMatrix);

            // adjustCamera(this.focusGroup);
            this.assignDefaultAllAccessory();
            this.buildPartList();

        }



    }
    beginDrag(plane, face, point) {



        this.focusPlane = plane;

        this.endSpin();
        if (this.previewObj != null) {
            this.accessoryHolder.remove(this.previewObj);
            plane.decorObj.addAccessory(this.previewObj);
        }
        this.decor3d.controls.enabled = false;



        if (!this.dragControls) {
            this.dragControls = new DecorDragControls(this.previewObj, this.decor3d.camera, this.decor3d.renderer.domElement);
        } else {
            this.dragControls.setTarget(this.previewObj);
            this.dragControls.activate();
        }

        //this.previewObj.position.set( 0, 0, 0 );


        if (plane.name.substr(0, 7) == '_aswall') {
            var normalMatrix = new THREE.Matrix3(); // create once and reuse
            var worldNormal = new THREE.Vector3(); // create once and reuse
            normalMatrix.getNormalMatrix(plane.matrixWorld);

            worldNormal.copy(face.normal).applyMatrix3(normalMatrix).normalize();
            //this.previewObj.lookAt(face.normal); //align to face
            this.previewObj.lookAt(worldNormal); //align to face
            this.dragControls.rotationEnabled(false); //prevent rotation
        } else {
            this.dragControls.rotationEnabled(true); //allow rotation(mouse wheel, gesture)
        }

        if (this.previewObj.defaultY != undefined) point.y = this.previewObj.defaultY;
        this.previewObj.position.copy(point);

        // calculate plane from face
        let pl = new THREE.Plane();

        var normalMatrix = new THREE.Matrix3(); // create once and reuse
        var worldNormal = new THREE.Vector3(); // create once and reuse



        normalMatrix.getNormalMatrix(plane.matrixWorld);
        worldNormal.copy(face.normal).applyMatrix3(normalMatrix).normalize();
        pl.setFromNormalAndCoplanarPoint(worldNormal, point);
        this.dragControls.setPlane(pl);
        this.previewObj.myDragPlane = pl;
        this.dragControls.addEventListener('dragend', this.dragEnded.bind(this));

        // if this is added to a wall, pass over control to the Room planner
        if (plane.name.substr(0, 7) == '_aswall' || plane.name.substr(0, 8) == '_asfloor') this.dragEnded();


    }
    dragEnded() {

        this.dragControls.deactivate();
        this.decor3d.controls.enabled = true;
        this.focusPlane.decorObj.turnOffSnapPoints();
        this.focusPlane.decorObj.createHoles();

    }

    /*animateDecorObject(target) {
        this.endSpin();
        if (this.previewObj != null) {
            this.accessoryHolder.remove(this.previewObj);
            target.decorObj.addAccessory(this.previewObj);
            this.previewObj.position.add(this.accessoryHolder.getWorldPosition(this.wp));
            this.previewObj.position.sub(target.decorObj.getWorldPosition(this.wp));
            this.previewObj.quaternion.copy(this.accessoryHolder.quaternion);
            this.accessoryTween = new TWEEN.Tween(this.previewObj.position).to(target.getWorldPosition(this.wp), this.cameraTweenLength).start();
            this.accessoryRotTween = new TWEEN.Tween(this.previewObj.quaternion).to(target.quaternion, this.cameraTweenLength).start();
            this.accessoryTween.onComplete(function(){ this.stopAnimate()});
            this.animate();
           
            this.assignDefaultAllAccessory();
            this.buildPartList();

        }
    }*/
    animateDecorObject(target) {
        this.endSpin();
        if (this.previewObj != null) {
            this.accessoryHolder.remove(this.previewObj);
            //group may not be at world center.
            this.focusGroup.updateMatrixWorld();
            //let tempMatrix = new THREE.Matrix4().copy(this.focusGroup.matrix);
            let tempPos = new THREE.Vector3().copy(this.focusGroup.position);
            let tempRot = new THREE.Quaternion().copy(this.focusGroup.quaternion);
            //move to center and remove rotation temporarily.
            this.focusGroup.position.x = this.focusGroup.position.y = this.focusGroup.position.z = 0;
            this.focusGroup.quaternion.copy(new THREE.Quaternion());
            this.focusGroup.updateMatrixWorld();
            target.decorObj.addAccessory(this.previewObj);
            this.previewObj.applyMatrix4(target.matrix);
            //MOve back to position and rotation
            //this.focusGroup.applyMatrix4(tempMatrix);
            this.focusGroup.quaternion.copy(tempRot);
            this.focusGroup.position.copy(tempPos);

            // adjustCamera(this.focusGroup);
            this.assignDefaultAllAccessory();
            this.buildPartList();

        }
    }
    placeDirect(target) {
        this.endSpin();
        if (this.previewObj != null) {
            this.accessoryHolder.remove(this.previewObj);
            this.previewObj.applyMatrix4(target.matrix);
            target.decorObj.addAccessory(this.previewObj);

            // adjustCamera(this.focusGroup);
            this.assignDefaultAllAccessory();
            this.buildPartList();

        }
    }
    buildPartList(checkmenu = true) {
        if (this.updateMenu) DD2022.createList(this.focusGroup, this.choosenFinish, checkmenu);
    }
    loadEnvironment(params) {
        if (this.decor3d.envLayer.children.length > 0) {
            if (this.decor3d.envLayer.children[0].isRoom) {
                return;
            }
        }
        //remove any previous environment
        let scope = this;
        this.decor3d.envLayer.children.forEach(function (obj) {
            scope.decor3d.envLayer.remove(obj);
        });
        this.decor3d.floor.visible = false;
        if (params.model_class == "DecorObject") {
            var env = new DecorObject();
            //var env = new DecorObject();
            let scope = this;
            env.loadModel(params.id, params.model, '000', scope.envLoaded);
            env.name = params.model;
            env.snap = params.snap;
            this.decor3d.envLayer.add(env);
            if (this.availableSnaps.length > 0) {
                env.position.copy(this.availableSnaps[0].position);
                this.stopPlacement();
            }


        } else {

            const dynClass = async _ => {

                const module = await import("/classes/" + params.model_class + ".js");
                var env = new module.default;
                env.name = params.model;
                env.metadata = params.metadata;
                env.isRoom = true; // prevent selection?
                env.defaultMaterialID = params.default_material;
                env.default_material_key = params.default_material_key;
                this.decor3d.envLayer.add(env);
                env.loadModel(params.id, params.model, '000', function () {
                    if (params.accessories) {
                        params.accessories.forEach(acc => {
                            scope.loadAccessory(env, acc);
                        })
                        //env.createHoles();
                    }
                    DD2022.loadMenu(env);
                });


                if (this.availableSnaps.length > 0) {
                    env.position.copy(this.availableSnaps[0].position);
                    this.stopPlacement();
                }


            }
            dynClass();
        }

    }
    envLoaded() {
        console.log("env loaded");
    }
    /*  function loadDynamicClass(){
          console.log("loading...", dynamicClass);
          var env = Object.create(dynamicClass.prototype);
         // env.loadModel('env', "room.glb");
      } */
    showPreview(obj) {
        //remove any previous model
        this.removePreview();
        if (this.availableSnaps.length < 1) { return };
        this.endSpin();
        obj.cb = null;
        if (obj.model_class == "DecorObject") {
            this.previewObj = this.createModel(obj);
            this.accessoryHolder.add(this.previewObj);
            this.lastLoadedModel = this.previewObj;
            this.startSpin();
            this.mousemode = "placement";
            //if only one available snap point is available and is not snap plane...
            if (this.availableSnaps.length == 1 && obj.autoplace && !this.availableSnaps[0].isPlane) {
                render();
                this.removeAnyExisting(this.availableSnaps[0]);
                this.placeDirect(this.availableSnaps[0]);
                if (obj.include.length > 0) {

                    this.addInclude(obj.include);
                }
                // animateDecorObject(this.availableSnaps[0]);
                this.stopPlacement();
            }
        } else {
            let scope = this;
            this.createDynamicModel(obj, function (prev) {
                scope.previewObj = prev;
                scope.accessoryHolder.add(scope.previewObj);
                scope.lastLoadedModel = scope.previewObj;
                scope.startSpin();
                scope.mousemode = "placement";
                //if only one available snap point is available and is not snap plane...
                if (scope.availableSnaps.length == 1 && obj.autoplace && !scope.availableSnaps[0].isPlane) {
                    render();
                    scope.removeAnyExisting(scope.availableSnaps[0]);
                    scope.placeDirect(scope.availableSnaps[0]);
                    if (obj.include.length > 0) {

                        scope.addInclude(obj.include);
                    }
                    // animateDecorObject(this.availableSnaps[0]);
                    scope.stopPlacement();
                }
            });
        }

    }
    addInclude(sku) {
        //check if already included
        let included = false;
        this.focusGroup.getAccessories().forEach(function (a) {

            if (a.sku == sku) included = true;
        });

        if (included) return;
        //get model from server
        fetch(ltvs__source + '/clients/getmodel/none/' + sku + '/0')
            .then(response => response.json())
            .then(data => {

                let params = data.params;
                this.addAccessory(params);
            });


    }
    assignDefaultAllAccessory() {
        if (!this.defaultAllAccessory) return;
        let snappoints = this.lastLoadedModel.turnOnSnapPoints(this.defaultAllAccessory.snap);
        this.replicate(snappoints, this.defaultAllAccessory);

    }
    removePreview() {
        this.accessoryHolder.children.forEach(function (obj) {
            obj.parent.remove(obj);
        })
    }
    showExtremities() {
        //turn off occupied snap points 

        let extremes = [];
        let boxes = this.focusGroup.drawBounding('wood', false);

        let box = new THREE.Box3();
        let occupied = false;
        let c1 = new THREE.Vector3();
        let c2 = new THREE.Vector3();
        this.availableSnaps.forEach(function (snap) {
            occupied = false;
            box.setFromObject(snap);

            boxes.forEach(function (b) {
                //target now required by threejs
                b.getCenter(c1);
                box.getCenter(c2);
                if (box.containsPoint(c1) || b.containsPoint(c2)) {
                    occupied = true;
                }
            });
            if (occupied) {
                snap.visible = false;
            } else {
                extremes.push(snap);
            }

        });

        this.availableSnaps = extremes;
        render();
    }
    weedSnaps(exclude, snap, array) {
        let debug = false;
        let unoccupied = [];
        let boxes = this.focusGroup.drawOccupied(exclude, debug);
        let occupied = false;
        let box = new THREE.Box3();
        let scope = this;
        array.forEach(function (snapitem) {
            occupied = false;
            box.setFromObject(snapitem);
            if (debug) {
                let helper = new THREE.Box3Helper(box, 0xff00FF);
                scope.decor3d.scene.add(helper);
            }
            boxes.forEach(function (b) {
                /* if (box.containsPoint(b.getCenter()) || b.containsPoint(box.getCenter())) {
                     occupied = true;
                 }*/
                if (box.intersectsBox(b)) {
                    occupied = true;
                }
            });
            if (occupied) {
                snapitem.visible = false;
            } else {
                unoccupied.push(snapitem);
            }

        });
        return unoccupied;
    }

    animate(time) {
        this.aniReq = window.requestAnimationFrame(this.animate.bind(this));
        render();
        TWEEN.update(time);

    }
    stopAnimate() {
        //console.log("stop animation");
        window.cancelAnimationFrame(this.aniReq);
    }


    startSpin() {

        this.rotationAngle = 0;
        if (this.spinnerTween == null) {
            this.spinnerTween = new TWEEN.Tween();
        }
        this.spinnerTween.repeat(Infinity);
        let scope = this;
        this.spinnerTween.onUpdate(function () {
            scope.spinItem();
            render();
        });

        this.spinnerTween.start();
        this.animate();

    }
    spinItem() {

        this.rotationAngle += 1;
        this.accessoryHolder.quaternion.setFromAxisAngle(this.YAXIS, this.rotationAngle * Math.PI / 180);
    }
    endSpin() {
        if (this.spinnerTween) {
            this.spinnerTween.stop();
            this.stopAnimate();
        }
    }



    replicate(targets, obj) {
        this.defaultAllAccessory = obj;
        let scope = this;
        targets.forEach(function (targ) {
            let base = scope.createModel(obj);
            base.position.copy(targ.position);
            targ.decorObj.addAccessory(base);
            if (!obj.model.includes('.fixed')) base.quaternion.copy(targ.quaternion);
            if (obj.model.includes('.fixed')) {
                if (targ.decorObj.quaternion.z > 0) {

                    base.rotateZ(Math.PI);
                }
            }
        });
        this.handles = targets;
        this.duplicationModel = obj.model; //Save for new models 
        this.focusGroup.turnOffSnapPoints();
        this.buildPartList(false); //don't redraw the menu system, nothing can be added

        render();
    }
    loadSecondTierAccessories() {
        console.log("2nd tier");
        for (var i = this.unloadedDefaultAccessories.length - 1; i > -1; i--) {
            let acc = this.unloadedDefaultAccessories[i];
            acc.includeByDefault = true;
            let any = this.addAccessory(acc, true);
            if (any < 1) {
                //run again
                setTimeout(this.loadSecondTierAccessories.bind(this), 500);
            } else {
                this.unloadedDefaultAccessories.splice(i, 1);
            }
        };
    }

    adjustCamera(target) {
        if (this.firsttime) { this.firsttime = false; return; };
        if(!this.autoCam) return;

        render();
        let boundingBox = new THREE.Box3().setFromObject(target);
        let size = new THREE.Vector3();
        boundingBox.getSize(size) // Returns Vector3
        boundingBox.getCenter(this.decor3d.controls.target);
        this.decor3d.camera.position.y = size.y / 2;
        this.decor3d.camera.position.x = target.position.x;
        //let zdim = Math.max(size.x, size.y) * 1.5;
        let zdim = Math.max(size.x, size.y) * 10;
        this.decor3d.camera.position.z = Math.max(1, zdim);
        this.decor3d.camera.updateProjectionMatrix();


        this.decor3d.controls.update();
        render();

    }
    animateCamera(target, speed = null) {
        if (target.classtype == "DynamicRoom") return;
        let boundingBox = new THREE.Box3().setFromObject(target);
        let size = new THREE.Vector3();

        boundingBox.getSize(size) // Returns Vector3

        let controlDestination = new THREE.Vector3();
        let cameraDestination = new THREE.Vector3();
        boundingBox.getCenter(controlDestination);

        cameraDestination.y = (size.y / 2) + 0.7;
        cameraDestination.x = controlDestination.x; - 0.7;
        let zdim = Math.max(size.x, size.y) * 1.5;
        cameraDestination.z = Math.max(1, zdim);
        let cameraSpeed;
        if (speed != null) {
            cameraSpeed = speed;
        } else {
            cameraSpeed = this.cameraTweenLength;
        }
        //this.decor3d.camera.position.copy(cameraDestination);
        //this.decor3d.controls.target.copy(controlDestination);
        //fixed camera position
        this.decor3d.camera.position.copy(new THREE.Vector3(0, 0.7, 4));
        this.decor3d.controls.target.copy(new THREE.Vector3(0, 0.7, 0));
        this.decor3d.controls.update();
        let window3d = this.decor3d;
        let scope = this;
        /*let fogTween = new TWEEN.Tween(window3d.scene.fog).to({ far: 10, near: 3 }, cameraSpeed);
        fogTween.onComplete(function () { scope.stopAnimate(); window3d.scene.fog = null; render(); });
        fogTween.start();
        this.animate(0);*/
        this.firsttime = false;
        /*let window3d = this.decor3d;
        this.cameraTween = new TWEEN.Tween(window3d.camera.position).to(cameraDestination, cameraSpeed);
        this.cameraTween.onUpdate(function () { window3d.controls.update(); console.log("moving?"); });
        this.cameraTween.easing(TWEEN.Easing.Sinusoidal.InOut);
        this.cameraTween.onComplete(function () { window3d.scene.fog = null; });
        this.cameraTween.start();
        this.targetTween = new TWEEN.Tween(window3d.controls.target).to(controlDestination, cameraSpeed).start();*/

    }

    /* async  {
         alert("ready for ar!");
         const exporter = new USDZExporter();
         const arraybuffer = await exporter.parse(this.focusGroup);
         const blob = new Blob([arraybuffer], { type: 'application/octet-stream' });
         let filename = this.focusGroup.name + '.usdz';
         link.href = URL.createObjectURL(blob);
         link.download = filename || 'data.usdz';
         link.click();
 
     
         const ioslink = document.getElementById( 'ioslink' );
         ioslink.href = URL.createObjectURL( blob );
    
 
     } */
    async exportAR() {
        console.log("export on ios");
        const exporter = new USDZExporter();
        const data = await exporter.parse(this.focusGroup);

        const blob = new Blob([data], { type: 'application/octet-stream' });
        const a = Object.assign(document.createElement('a'), {
            download: 'model.usdz',
            rel: "ar",
            href: URL.createObjectURL(blob)
        });
        let cpopup = document.getElementById('ar-popup');
        let closebt = document.createElement('div');
        closebt.classList.add('pop-up-close');
        closebt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
        closebt.addEventListener('mouseup', function () { $('#ar-popup').remove(); });
        let htmlStr = '<div class="message-container">'

        htmlStr += '<a download="model.usdz" rel="ar" href="' + URL.createObjectURL(blob) + '"><img width="150" height="38" id="ioslauncher" src="' + DD2022.server_path + '/icons/ARKit_Glyph_Button.svg"></a>';
        htmlStr += '</div>'
        cpopup.innerHTML = htmlStr;
        cpopup.appendChild(closebt);
        let holder = document.getElementById('dialogboxholder');
        holder.appendChild(cpopup);

        /*const img = document.getElementById('ioslauncher');
        const i = this.makeImage();
        a.appendChild(i);
        console.log("click");
        a.click();
        console.log("clicked");*/
    }
    async exportEnsemble() {

        //create a zip file
        let zip = new JSZip();
        const exporter = new USDZExporter();

        let filesToAdd = [];



        //take each element in the decor layer
        var i;
        let recipe = '#usda 1.0 \n  (\n defaultPrim = "Object" \n upAxis = "Y"';
        recipe += '\n customLayerData = {';
        let objList = '';
        let variants = '{ \n variantSet "Assets" = {';
        let def = '\n def Xform "Object" (';
        def += '\n variants = {';
        def += '\n string Assets = "' + this.decor3d.decorLayer.children[0].sku + '"';
        def += '\n } \n prepend variantSets = "Assets"  \n )';


        for (i = 0; i < this.decor3d.decorLayer.children.length; i++) {

            let name = this.decor3d.decorLayer.children[i].sku;
            let usdz_name = name + '.usdz';
            let usdz_ref = '@' + usdz_name + "@";

            objList += usdz_ref;
            variants += ' \n"' + name + '" (';
            variants += '\n    prepend references = ' + usdz_ref;
            variants += '\n ) { \n \n }';
            if (i < this.decor3d.decorLayer.children.length - 1) objList += ", ";
            //move to zero
            let origPos = new THREE.Vector3().copy(this.decor3d.decorLayer.children[i].position);
            this.decor3d.decorLayer.children[i].position.set(0, 0, 0);
            render();
            //create a usdz file
            const data = await exporter.parse(this.decor3d.decorLayer.children[i]);
            const blob = new Blob([data], { type: 'application/octet-stream' })
            let model = new File([blob], usdz_name, { type: 'application/octet-stream' });
            filesToAdd.push({ name: usdz_name, data: model });

            this.decor3d.decorLayer.children[i].position.copy(origPos);
            render();


        }
        variants += '\n} \n }';
        recipe += '\n asset[] assetLibrary = [' + objList + ']';
        recipe += '\n}';
        recipe += '\n )';
        recipe += '\n' + def;
        recipe += '\n' + variants;
        zip.file("decor.usda", recipe, { type: "base64" });
        var j;
        for (j = 0; j < filesToAdd.length; j++) {
            zip.file(filesToAdd[j].name, filesToAdd[j].data, { compression: "STORE" });
        }
        //download for debug
        /* zip.generateAsync({ type: "blob", compression: "STORE" })
             .then(function (blob) {
                 saveAs(blob, "hello.usdz");
             });*/


        //create download link and press
        zip.generateAsync({ type: "blob", compression: "STORE" })
            .then(function (blob) {
                const a = Object.assign(document.createElement('a'), {
                    download: 'decor.usdz',
                    rel: "ar",
                    href: URL.createObjectURL(blob)
                });
                let cpopup = document.getElementById('ar-popup');
                let closebt = document.createElement('div');
                closebt.classList.add('pop-up-close');
                closebt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
                closebt.addEventListener('mouseup', function () { $('#ar-popup').remove(); });
                let htmlStr = '<div class="message-container">'

                htmlStr += '<a download="decor.usdz" rel="ar" href="' + URL.createObjectURL(blob) + '"><img width="150" height="38" id="ioslauncher" src="' + DD2022.server_path + '/icons/ARKit_Glyph_Button.svg"></a>';
                htmlStr += '</div>'
                cpopup.innerHTML = htmlStr;
                cpopup.appendChild(closebt);
                let holder = document.getElementById('dialogboxholder');
                holder.appendChild(cpopup);

            });


    }

    /*  async exportEnsembleF() {
  
          //create a zip file
          let files = [];
          const modelFileName = 'recipe.usda';
          // model file should be first in USDZ archive so we init it here
          files[ modelFileName ] = null;
          const exporter = new USDZExporter();
  
          //take each element in the decor layer
          var i;
          let recipe = '#usda 1.0 \n  (\n defaultPrim = "Object" \n upAxis = "Y"';
          recipe += '\n customLayerData = {';
          let objList = '';
          let variants = '{ \n variantSet "Assets" = {';
          let def = '\n def Xform "Object" (';
          def += '\n variants = {';
          def += '\n string Assets = "' + this.decor3d.decorLayer.children[0].sku + '"';
          def += '\n } \n prepend variantSets = "Assets"  \n )';
  
  
          for (i = 0; i < this.decor3d.decorLayer.children.length; i++) {
  
              let name = this.decor3d.decorLayer.children[i].sku;
              let usdz_name = name + '.usdz';
              let usdz_ref = '@' + usdz_name + "@";
  
              objList += usdz_ref;
              variants += ' \n"' + name + '" (';
              variants += '\n    prepend references = ' + usdz_ref;
              variants += '\n ) { \n \n }';
              if (i < this.decor3d.decorLayer.children.length - 1) objList += ", ";
              //create a usdz file
              const data = await exporter.parse(this.decor3d.decorLayer.children[i]);
              const blob = new Blob([data], { type: 'application/octet-stream' });
              let model = new Uint8Array(blob);
              //let model = new File([blob], usdz_name, { type: 'application/octet-stream' });
              files[usdz_name] = model;
  
          }
          variants += '\n} \n }';
          recipe += '\n asset[] assetLibrary = [' + objList + ']';
          recipe += '\n}';
          recipe += '\n )';
          recipe += '\n' + def;
          recipe += '\n' + variants;
          //let usda = new Blob([recipe], { name: 'hello.usda', type: 'text/plain' });
          files[modelFileName] = fflate.strToU8(recipe);
  
          // 64 byte alignment
          // https://github.com/101arrowz/fflate/issues/39#issuecomment-777263109
  
          let offset = 0;
  
          for ( const filename in files ) {
  
              const file = files[ filename ];
              const headerSize = 34 + filename.length;
  
              offset += headerSize;
  
              const offsetMod64 = offset & 63;
  
              if ( offsetMod64 !== 4 ) {
  
                  const padLength = 64 - offsetMod64;
                  const padding = new Uint8Array( padLength );
  
                  files[ filename ] = [ file, { extra: { 12345: padding } } ];
  
              }
  
              offset = file.length;
  
          }
  
          let gzipped = fflate.zipSync( files, { level: 0 } );
          
          saveAs(gzipped, "hello.usdz");
          
          
  
          //create download link and press
          /*
  
          const a = Object.assign(document.createElement('a'), {
              download: 'decor.usdz',
              rel: "ar",
              href: URL.createObjectURL(gzipped)
          });
          let cpopup = document.getElementById('ar-popup');
          let closebt = document.createElement('div');
          closebt.classList.add('pop-up-close');
          closebt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
          closebt.addEventListener('mouseup', function () { $('#ar-popup').remove(); });
          let htmlStr = '<div class="message-container">'
  
          htmlStr += '<a download="decor.usdz" rel="ar" href="' + URL.createObjectURL(blob) + '"><img width="150" height="38" id="ioslauncher" src="' + DD2022.server_path + '/icons/ARKit_Glyph_Button.svg"></a>';
          htmlStr += '</div>'
          cpopup.innerHTML = htmlStr;
          cpopup.appendChild(closebt);
          let holder = document.getElementById('dialogboxholder');
          holder.appendChild(cpopup);
  
  
      }*/



    iOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    exportSingle() {

        //for test, always export ensemble
        //this.exportEnsemble();
        //return;

        DD2022.decorRoomPlanner.lowlight();

        if (this.iOS()) {
            this.exportAR(); //single selected object
            //this.exportEnsemble();
            return;
        }
        //this.exportAR();
        //return;


        var exporter = new DecorGLTFExporter();

        //var target = furnitureLayer;
        //var target = this.focusGroup;
        var target = this.focusGroup;
        render();
        var scope = this;
        var filename = "ar";
        /* if (this.focusGroup.name != undefined) {
             filename = this.focusGroup.name.substr(0,this.focusGroup.name.lastIndexOf('.'));
         }*/


        if (target != null) {
            exporter.parse(target, function (result) {

                scope.saveArrayBuffer(result, filename + '.glb');

                // forceIndices: true, forcePowerOfTwoTextures: true
                // to allow compatibility with facebook
            }, { binary: true, forceIndices: false, forcePowerOfTwoTextures: true, onlyVisible: false });
        }
        // <a href="intent://arvr.google.com/scene-viewer/1.0?file=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;">Avocado</a>;
    }



    saveArrayBuffer(buffer, filename) {

        this.saveFile(new Blob([buffer], { type: 'application/octet-stream' }), filename);

    }
    saveFile(blob, filename) {

        // this is the Android version, which requires saving to server
        var fd = new FormData();
        fd.append('file', blob, filename);
        let server_path = '';
        fetch(DD2022.server_path + '/ar/upload', {
            method: 'POST',
            body: fd
        })
            .then(response => response.json())
            .then(data => {
                console.log("DATA", data);
                if (data.message = "complete") {
                    let path = DD2022.server_path + '/ar/open/' + data.count;
                    let cpopup = document.getElementById('ar-popup');
                    let closebt = document.createElement('div');
                    closebt.classList.add('pop-up-close');
                    closebt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
                    closebt.addEventListener('mouseup', function () { $('#ar-popup').remove(); });
                    let htmlStr = '<div class="message-container">'
                    //htmlStr += this.server_path + "/designs/share/" + data.id ;
                    //remove any existing design reference
                    let winloc = "https://lifetimekidsrooms.dk/pages/room-planner";
                    // let winlocStripped = winloc.split('?')[0];
                    //htmlStr += winloc +  "?designid=" + data.id ;
                    //htmlStr += '</textarea>';
                    if (this.ARcompatible()) {
                        htmlStr += '<button class="copy-but" onmousedown="window.open(\'' + path + '\', \'_blank\').focus()"><img width="24" height="24" src="' + DD2022.server_path + '/icons/view_in_ar_black_24dp.svg">OPEN</button></div>';
                    } else {
                        htmlStr += '<div id="qrcode" style="width: 220px;"><img src="' + DD2022.server_path + '/imgs/qr/https---vinlagringse.customshop.online-ar-open-' + data.count + '.png" ></div>';
                        htmlStr += '<div style="padding:10px"><a href="' + path + '" target="_blank">' + path + '</a><br>Åben på en iPhone, iPad eller Android telefon</div>'
                    }
                    cpopup.innerHTML = htmlStr;
                    cpopup.appendChild(closebt);
                    let holder = document.getElementById('dialogboxholder');
                    holder.appendChild(cpopup);


                    // window.open(DD2022.server_path + '/ar/open/' + data.count, '_blank').focus();
                }
            });

    }


    createModel(obj) {
        //console.log("OBJ", obj);
        //var prev = new DecorObject();


        var prev = new DecorObject();
        prev.signature = obj;
        prev.registerProperties();
        if (obj.default_material_key == this.masterDefaultKey) {
            obj.default_material = this.masterDefaultMaterial;
        }

        //if a default material is specified, create or get from cache
        if (obj.default_material && String(obj.default_material).length > 0 && obj.default_material_key && obj.default_material_key.length == 4) {
            let finish;
            if (this.masterDefaultKey == obj.default_material_key) {
                finish = this.choosenFinish;
            } else {
                finish = "none";
                console.log("Finish set to none", obj, this.masterDefaultKey);
            }
            MaterialManager.assignMaterial(prev, obj.default_material, obj.default_material_key, finish);
            prev.defaultMaterialID = obj.default_material;
            console.log("APPLYING", obj.default_material, obj.sku);
        }
        if (obj.flip) prev.flipX = obj.flip;
        if (obj.mirror) prev.mirror = obj.mirror;
        prev.loadModel(obj.id, obj.model, obj.sku, obj.cb);
        prev.isGroupMember = obj.isGroupMember;
        prev.snap = obj.snap;
        prev.snap_type = obj.snap_type;
        prev.exclude = obj.exclude;

        if (obj.includeByDefault != undefined) prev.includeByDefault = obj.includeByDefault;
        if (this.defaultAccessorySkus.includes(obj.sku)) prev.includeByDefault = true;
        return prev;



    }

    async createDynamicModel(obj, callback) {
        const dynClass = async _ => {

            const module = await import("/classes/" + obj.model_class + ".js");
            var prev = new module.default;
            if (obj.default_material_key == this.masterDefaultKey) {
                obj.default_material = this.masterDefaultMaterial;
            }
            prev.signature = obj; //prevent having to go back to server
            prev.registerProperties();
            //if a default material is specified, create or get from cache
            if (obj.default_material && String(obj.default_material).length > 0 && obj.default_material_key && obj.default_material_key.length == 4) {
                MaterialManager.assignMaterial(prev, obj.default_material, obj.default_material_key, this.choosenFinish);

            }
            if (obj.metadata) prev.setMetaData(obj.metadata);
            let scope = this;
            prev.loadModel(obj.id, obj.model, obj.sku, function () {
                obj.cb;

                callback(prev);


            });
            prev.isGroupMember = obj.isGroupMember;
            prev.snap = obj.snap;
            prev.snap_type = obj.snap_type;
            prev.exclude = obj.exclude;
            if (obj.includeByDefault != undefined) prev.includeByDefault = obj.includeByDefault;

        }
        dynClass();

    }


    applyDefaultMaterial() {
        if (this.masterDefaultKey && this.masterDefaultMaterial) {
            this.changeMaterial(this.masterDefaultKey, this.masterDefaultMaterial, this.choosenFinish);
        }
    }
    firstZoom() {
        // dev__hidespinner();
        this.animateCamera(this.lastLoadedGroup, 1000);

    }
    /* removeSnapType(snaptype) {
 
         //get the snap points of this type
         let sps = this.focusGroup.turnOnSnapPoints(snaptype);
         let scope = this;
         sps.forEach(function (sp) {
             scope.focusGroup.removeAccessoryAt(sp);
         })
         this.focusGroup.turnOffSnapPoints();
         render();
     } */
    removeSnapType(snaptype) {
        this.focusGroup.removeAllAccessoriesBySnap(snaptype);
    }
    masterReset(keeproom) {

        console.log("keeproom", keeproom);

        while (this.decor3d.decorLayer.children.length > 0) {
            this.decor3d.decorLayer.remove(this.decor3d.decorLayer.children[0]);
        }
        if (!keeproom) {
            while (this.decor3d.envLayer.children.length > 0) {
                this.decor3d.envLayer.remove(this.decor3d.envLayer.children[0]);
                this.decor3d.floor.visible = true;
            }
        }
        while (this.accessoryHolder.children.length > 0) {
            this.accessoryHolder.remove(this.accessoryHolder.children[0]);
        }
        this.focusGroup = null;
        this.decor3d.floor.visible = true;
        this.unloadedDefaultAccessories = [];
        this.decorGroups = [];
        render();
    }
    replaceFocusGroup() {

        // this.masterReset();
        this.decor3d.decorLayer.remove(this.focusGroup);

    }
    changeFocusGroup(group) {
        if (group != this.focusGroup) { //prevent re-selection 

            this.focusGroup = group;
            this.buildPartList();
        }
    }



    addDecorObject(params, replace = false) {

        this.masterDefaultMaterial = null;
        this.masterDefaultKey = null;
        //replace any existing model? 
        if (replace) {
            this.replaceFocusGroup();
        }
        // create queue for standard accessories
        if (params.defaultAccessories != undefined) {
            this.accessoryQueueLength = params.defaultAccessories.length;
            this.unloadedDefaultAccessories = params.defaultAccessories.slice();
        }

        //keep the finish extension as default
        /*let ext = params.sku.lastIndexOf('-')
        this.masterSKU = params.sku;

        if (ext > 0) { // -1 evaluates to true!!!
            this.choosenFinish = params.sku.substr(ext + 1);
        }else{
            this.choosenFinish = "";
        }*/

        if (params.default_material != undefined && params.default_material_key.length > 0) {
            this.masterDefaultMaterial = params.default_material;
            this.masterDefaultKey = params.default_material_key;

        }




        //standard or custom object?
        let decorObj;
        let scope = this;
        if (params.model_class == "DecorObject") {
            params.cb = function () {

                render();
                DD2022.loadMenu(scope.lastLoadedModel);
            };
            decorObj = this.createModel(params);
            this.onNewDecorObject(decorObj, params);

        } else {
            this.createDynamicModel(params, mod => {
                DD2022.loadMenu(mod);
                render();
                this.onNewDecorObject(mod, params);

            });
        }

    }
    onNewDecorObject(decorObj, params) {

        this.lastLoadedModel = decorObj;
        this.focusGroup = decorObj;
        if (params.snap_type == "environment") {
            this.decor3d.envLayer.add(decorObj);
            decorObj.isRoom = true;
        } else {
            this.decor3d.decorLayer.add(decorObj);
        }
        if (params.matrix != undefined) {
            let mat = new THREE.Matrix4().fromArray(params.matrix);
            decorObj.applyMatrix4(mat);
        }
        if (params.loadOwnParameters) {
            decorObj.loadParameters();
        }
        if (this.firsttime) this.animateCamera(decorObj);
        this.loadSecondTierAccessories();
        //this.applyDefaultMaterial(); // Makes floors adopt default material
        let scope = this;
        if (params.added_accessories && params.added_accessories.length > 0) {

            params.added_accessories.forEach(acc => {
                scope.loadAccessory(decorObj, acc);
            })
            scope.buildPartList();

        } else {
            scope.buildPartList();
        }
        //DD2022.decorObjectLoaded();
    }

    loadAccessory(decorObj, acc) {

        acc.cb = function () {
            decorObj.createHoles();
            decorObj.checkOrientation();
        }
        let mat = new THREE.Matrix4().fromArray(acc.matrix);
        let dp = null;
        if (acc.dragplane) {
            dp = new THREE.Plane(new THREE.Vector3(acc.dragplane.normal.x, acc.dragplane.normal.y, acc.dragplane.normal.z), acc.dragplane.constant);

        }
        let scope = this;
        if (decorObj.classtype == "DecorObject") {
            let decorAcc = this.createModel(acc);
            decorAcc.applyMatrix4(mat);
            decorObj.addAccessory(decorAcc);
            if (dp != null) decorAcc.myDragPlane = dp;
            //has this accessory got accessories?
            if (acc.added_accessories && acc.added_accessories.length > 0) {
                console.log("ACCESSORIES", acc.added_accessories);
                acc.added_accessories.forEach(ac => {
                    scope.loadAccessory(decorAcc, ac);
                })

            }


        } else {

            this.createDynamicModel(acc, mod => {
                mod.applyMatrix4(mat);
                decorObj.addAccessory(mod);
                if (dp != null) mod.myDragPlane = dp;
                decorObj.createHoles();
                //has this accessory got accessories?
                if (acc.added_accessories && acc.added_accessories.length > 0) {

                    acc.added_accessories.forEach(ac => {
                        scope.loadAccessory(mod, ac);
                    })

                }
            })
        }
    }

    setCamera() {
        this.decor3d.camera.add(this.accessoryHolder);
        this.accessoryHolder.position.z = -2;
        this.accessoryHolder.position.y = 0.5;
    }



    addAccessory(params, isGroupMember = false) {
        params.isGroupMember = isGroupMember;
        this.modelToLoad = params.model;
        this.availableSnaps = [];
        let scope = this;
        /*this.decorGroups.forEach(function (decorGr) {
            // returns number of snaps available
            var s = decorGr.turnOnSnapPoints(params.snap);
            scope.availableSnaps = scope.availableSnaps.concat(s);
        });*/
        this.availableSnaps = this.focusGroup.turnOnSnapPoints(params.snap);

        //can also be within environment...
        if (this.decor3d.envLayer.children.length > 0) {
            var es = this.decor3d.envLayer.children[0].turnOnSnapPoints(params.snap);
            this.availableSnaps = this.availableSnaps.concat(es);
        }
        if (params.exclude.length > 0) this.availableSnaps = this.weedSnaps(params.exclude, params.snap, this.availableSnaps);

        let obj;

        switch (params.snap_type) {

            // Apply to all snap points 
            case 'all':
                //don't change if already assigned
                if (this.defaultAllAccessory) {
                    this.focusGroup.removeBySKU(this.defaultAllAccessory.sku)
                }
                this.replicate(this.availableSnaps, params);
                break;
            // Add to group, not member of group
            case 'single':
                this.autoCam = false;
                this.placeEntity = false;
                params.autoplace = true;
                this.showPreview(params);
                render();
                break;
            // Add to any member of group
            case 'environment':
                this.autoCam = false;
                this.placeEntity = false;
                //special type, not part of the model to be saved.
                this.loadEnvironment(params);
                break;
            case 'extreme':
                this.autoCam = false;
                this.placeEntity = false;
                //turn off all but the extremities 
                this.showExtremities();
                if (this.masterDefaultMaterial && this.masterDefaultKey) {
                    params.default_material = this.masterDefaultMaterial;
                    params.default_material_key = this.masterDefaultKey;
                }
                params.autoplace = false;
                this.showPreview(params);
                break;
            case 'entity': //entity is a separteModel (not accessory) to become part of the group, but with allocated position from snap point
                this.placeEntity = false;
                params.cb = null;
                let decorObj = createModel(params);
                decorObj.position.copy(this.availableSnaps[0].position);
                this.focusGroup.addMember(decorObj);
                this.focusGroup.add(decorObj);
                //lastLoadedModel = decorObj;
                break;
            case 'surface':
                //add at the default position, but keep as a seperate entity
                this.autoCam = false;
                this.placeEntity = false;
                params.autoplace = true;
                this.showPreview(params);
                render();
                break;

                break;
            default:
                this.autoCam = false;
                this.placeEntity = false;
                params.autoplace = true;
                this.showPreview(params);
                render();
                break;
        }
        return this.availableSnaps.length;
    }

    checkSnapAvailability(snap, excludes) {
        let snaps = this.focusGroup.getSnapPoints(snap);
        if (excludes.length > 0) snaps = this.weedSnaps(excludes, snap, snaps);
        //  this.focusGroup.turnOffSnapPoints();
        // console.log(snap);
        return snaps.length;

    }

    setWindowSize(w, h) {
        width3d = w;
        height3d = h;
    }
    update() {
        if (TWEEN) {
            TWEEN.update();
        }
    }
    changeMaterial(key, matid, extension) {
        let scope = this;
        MaterialManager.getMaterial(matid, function (material) {
            scope.focusGroup.changeMaterial(key, material, extension, matid);
        });
        this.masterDefaultMaterial = matid;
        this.choosenFinish = extension;
        this.buildPartList(true);
    }

    ARcompatible() {

        if (this.iOS()) {

            return true;
        };
        if (/Android/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    }
    clearPreview() {
        this.removePreview();
    }
    assignMaterial(key, matid, extension) {
        // MaterialManager.assignMaterial(lastLoadedModel, material, key);
        this.changeMaterial(key, matid, extension);
    }
    removeItem(item) {
        this.focusGroup.removeItem(item);
        this.buildPartList();
        render();
    }
    removeBySKU(sku) {
        this.focusGroup.removeBySKU(sku);
        this.defaultAllAccessory = null;
        this.buildPartList();
    }
    exportGLB() {
        exportSingle();
    }
    mirrorGroup() {
        this.focusGroup.mirrorGroup();
    }
    loadVariant(id) {

        /* 
         masterReset();
         loadGroup(id,model,masterDefaultMaterial,masterDefaultKey,masterSKU,default_accessories);*/
    }
    getFocusGroup(x, y) {

        this.mouse.x = (x / this.decor3d.width3d) * 2 - 1;
        this.mouse.y = - (y / this.decor3d.height3d) * 2 + 1;
        this.decor3d.camera.updateMatrixWorld();
        this.raycaster.setFromCamera(this.mouse, this.decor3d.camera);


        let scope = this;

        let intersects = this.raycaster.intersectObjects(this.decor3d.decorLayer.children, true);
        let obj = null;
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].object.name.substr(0, 3) != '_as') {
                    obj = intersects[i].object;
                    break;
                }
            }
        }



        if (obj) {
            let depth = 10; //prevent loop from continuing efter 10 levels
            let decobj = null;
            while (obj.parent) {
                if (obj.parent.snap_type == "surface") decobj = obj.parent;
                if (obj.parent.parent == this.decor3d.decorLayer) {


                    this.changeFocusGroup(obj.parent);
                    return { group: obj.parent, object: decobj };
                } else {
                    obj = obj.parent;
                }
                depth -= 1;
                if (depth < 1) { return null };
            }
        } else {
            return null;
        }
    }
    saveDesign() {

        decorIO.saveDesign(targetLayer, envLayer);
    }
    reset() {
        masterReset();
    }
    removeSelectedGroup() {

        this.decor3d.decorLayer.remove(this.focusGroup);

        render();
        this.focusGroup = null;
        DD2022.resetPartsList();
    }
    addUserModel(model) {
        let importedModel = new DecorObject();
        importedModel.injectModel(model);
        this.decor3d.decorLayer.add(importedModel);
    };



};

export default DecorManager;


