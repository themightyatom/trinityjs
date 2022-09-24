
import * as THREE from '/three/build/three.module.js';
import { DecorDragControls } from '/js/DecorDragControls.js';
import DecorLogin from '/js/DecorLogin.js';
import MaterialManager from '/js/MaterialManager.js';
import DimensionLine from '/js/DimensionLine.js';



class DecorRoomPlanner {
    constructor(decor3d, manager) {

        console.log("CREATING ROOM PLANNER");
        const ltvs_menuHolder = document.createElement("div");
        ltvs_menuHolder.setAttribute("id", "ltvs_menuHolder");
        ltvs_menuHolder.classList.add("ltvs-menu-holder");
        document.body.appendChild(ltvs_menuHolder);
        window.DecorRoomPlanner = this;
        this.targetCanvas = document.getElementById('ltvs_container');
        this.clientCoordsX = 0;
        this.clientCoordsY = 0;
        this.currentTarget;
        this.markerBox;
        this.markerBoxGraphic = null;
        this.moveTool;
        this.rotateTool;
        this.dragControls;
        this.raycaster = new THREE.Raycaster();
        this.raycaster.params.Line.threshold = 0.0;
        this.raycaster.params.Points.threshold = 0.0;
        this.raycaster.params.Mesh.threshold = 0.0;
        this.camera = decor3d.camera;
        this.decor3d = decor3d;
        this.manager = manager;
        this.collisionRay = new THREE.Raycaster();
        this.rayPos = new THREE.Vector3(0, 0.01, 0);
        this.rayCenter = new THREE.Vector3(0, 0.01, 0);
        this.raySize = new THREE.Vector3();
        this.snapPos = new THREE.Vector3();
        this.rightPos = new THREE.Vector3();
        this.leftPos = new THREE.Vector3();
        this.frontPos = new THREE.Vector3();
        this.snapDistance = 0.1;
        this.rayOffset = new THREE.Vector3(0, 0.01, 0);
        this.rayDirection = new THREE.Vector3(0, 0, 1);
        this.maxX = new THREE.Vector3();
        this.minX = new THREE.Vector3();
        this.maxZ = new THREE.Vector3();
        this.minZ = new THREE.Vector3();
        this.vector = new THREE.Vector2();
        this.vector3d = new THREE.Vector3();
        this.rayHits = [0, 0, 0, 0];
        this.objDistances = [0, 0, 0, 0];
        this.mouse = new THREE.Vector2();
        this.YPLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        this.normalMatrix = new THREE.Matrix3(); // create once and reuse
        this.worldNormal = new THREE.Vector3(); // create once and reuse
        this.bbox = new THREE.Box3(); //for measuring selected items
        this.noRotate = new THREE.Quaternion();
        this.worldPos = new THREE.Vector3();

        this.wallArray = [];

        this.updateDrag = obj => this.collisionTest(obj);
        this.limitReset = e => this.resetLimits();

        this.currentWall;

        this.dimLines = [];

        this.dimLine0 = new DimensionLine(this.rayOffset, this.rayOffset, 0x000000, this.arrowWidth, this.arrowLength);
        this.dimLine1 = new DimensionLine(this.rayOffset, this.rayOffset, 0x000000, this.arrowWidth, this.arrowLength);
        this.dimLine2 = new DimensionLine(this.rayOffset, this.rayOffset, 0x000000, this.arrowWidth, this.arrowLength);
        this.dimLine3 = new DimensionLine(this.rayOffset, this.rayOffset, 0x000000, this.arrowWidth, this.arrowLength);

        this.dimLine0.position.y = 3;
        this.dimLine1.position.y = 3;
        this.dimLine2.position.y = 3;
        this.dimLine3.position.y = 3;

        this.dimLines.push(this.dimLine0, this.dimLine1, this.dimLine2, this.dimLine3);

        this.dropTarget = null;

        this.snapPoints = [];
        this.objectSnapPoints = [];

        //snap reuse
        this.cx = Infinity;
        this.cy = Infinity;
        this.cz = Infinity;
        this.px = 0;
        this.py = 0;
        this.pz = 0;
        this.tx;
        this.ty;
        this.tz;
        this.snapTolerance = 0.1;

        this.iter = 0;
        this.len = 0;
        this.pl = new THREE.Plane();
        this.lastEvent;
        this.rect;
        this.wallIntersects = [];
        this.surfaceIntersects = [];
        this.points;
        this.vec;
        this.dist;
        this.rdist;
        this.ldist;

        this.multiSelected = [];

    };


    loadRoomType() {
        console.log("done");
    }
   
    loadEnvironment(id) {
        this.removeUI()
        //clear environment
        let scope = this;
        this.decor3d.envLayer.children.forEach(function (obj) {
            scope.decor3d.envLayer.remove(obj);
        });
        this.loadNewModel(id);
    }
    loadNewModel(id) {
        //this.removeUI();
        let lang = ltvs__lang;
        DD2022.loadModel(id, lang, false);
        this.startSelectMoveTool();
    }
    removeUI() {
        ltvs_menuHolder.classList.remove("cover-full");
        ltvs_menuHolder.innerHTML = "";
    }
    buildWallArray() {
        this.wallArray = [];
        if (this.decor3d.envLayer.children.length > 0) {
            for (var w = 0; w < this.decor3d.envLayer.children[0].wallArray.length; w++) {
                this.wallArray.push(this.decor3d.envLayer.children[0].wallArray[w].snapSurface);
            }
            // add any accessories that contains _aswall
            for (var p = 0; p < this.decor3d.envLayer.children[0].accessoryLayer.children.length; p++) {

                /* if(this.decor3d.envLayer.children[0].accessoryLayer.children[p].wallArray.length > 0 ){
                     for(var i=0;i<this.decor3d.envLayer.children[0].accessoryLayer.children[p].wallArray.length;i++){
                         this.decor3d.envLayer.children[0].accessoryLayer.children[p].wallArray[i].geometry.computeBoundingBox();
                         this.decor3d.envLayer.children[0].accessoryLayer.children[p].wallArray[i].geometry.computeBoundingSphere();
                     }
                 }*/

                this.wallArray = this.wallArray.concat(this.decor3d.envLayer.children[0].accessoryLayer.children[p].wallArray);
            }
            //add floor for vertical measurements
            this.wallArray.push(this.decor3d.envLayer.children[0].floorsnap);
        }
    }

    buildObstructionArray() {
        this.obstructionArray = [];
        this.obstructionArray = this.obstructionArray.concat(this.wallArray);
        while (this.decor3d.controlLayer.children.length > 0) {
            this.decor3d.controlLayer.remove(this.decor3d.controlLayer.children[this.decor3d.controlLayer.children.length - 1]);
        }
        this.obstructionMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, visible: false });
        for (var i = 0; i < this.decor3d.decorLayer.children.length; i++) {
            if (this.decor3d.decorLayer.children[i] != this.currentTarget) {
                this.decor3d.decorLayer.children[i].turnOffSnapPoints();
                this.bbox.setFromObject(this.decor3d.decorLayer.children[i]);
                this.bbox.getCenter(this.rayCenter);
                this.bbox.getSize(this.raySize);
                let box = new THREE.Mesh(new THREE.BoxGeometry(this.raySize.x, this.raySize.y, this.raySize.z), this.obstructionMat);
                this.decor3d.controlLayer.add(box);
                box.position.copy(this.rayCenter);
                this.obstructionArray.push(box);
            }
        }
        //add room accessories (stairs etc)
        if (this.decor3d.envLayer.children.length > 0) {
            let layer = this.decor3d.envLayer.children[0].accessoryLayer;
            for (var j = 0; j < layer.children.length; j++) {
                if (layer.children[j] != this.currentTarget) {
                    layer.children[j].turnOffSnapPoints();
                    this.bbox.setFromObject(layer.children[j]);
                    this.bbox.getCenter(this.rayCenter);
                    this.bbox.getSize(this.raySize);
                    let box = new THREE.Mesh(new THREE.BoxGeometry(this.raySize.x, this.raySize.y, this.raySize.z), this.obstructionMat);
                    this.decor3d.controlLayer.add(box);
                    box.position.copy(this.rayCenter);
                    this.obstructionArray.push(box);
                }
            }
        }

    }

    startSelectMoveTool() {
        //always on??
        //this.targetCanvas.onpointerdown = this.registerDown.bind(this);
        DD2022.eventManager.addAction({ type: "down", target: this, func: "registerDown" });

        // this.targetCanvas.onpointerup = this.registerUp.bind(this);
        DD2022.eventManager.addAction({ type: "up", target: this, func: "registerUp" });

    }
    stopSelectMoveTool() {
        // this.targetCanvas.onpointerdown = null;
        // this.targetCanvas.onpointerup = null;
        DD2022.eventManager.removeAllActions(this);
        if (this.dragControls) this.dragControls.deactivate();
    }
    registerDown(e) {
        this.clientCoordsX = e.clientX;
        this.clientCoordsY = e.clientY;
        // check for move
        // DD2022.eventManager.addAction({type:"move", target:this, func:"registerMove"});

    }
    registerMove(e) {

        let testObj = this.manager.getFocusGroup(e.clientX, e.clientY);
        if (this.getRoomObject(e) != null) {
            DD2022.eventManager.removeAction({ type: "move", target: this, func: "registerMove" });
            return;
        }
        if (testObj != null) {
            this.registerUp({ clientX: this.clientCoordsX, clientY: this.clientCoordsY });
            this.dragControls.onPointerDown(e);
        } else {
            console.log("MOVE ended edit");
            DD2022.eventManager.removeAction({ type: "move", target: this, func: "registerMove" });
            //send event to navigation to begin orbit
            let startNav = false;
            if (this.currentTarget != null) startNav = true;

            this.endEdit();

            if (startNav) {
                console.log("pointers", this.decor3d.controls.pointers);
                this.decor3d.controls.onPointerUp(e);

                this.decor3d.controls.handleMouseDownRotate(e);
                this.decor3d.controls.onPointerDown(e);
                this.decor3d.controls.setState(0); //rotate mode

                //DD2022.eventManager.addAction({ type: "move", target: this.decor3d.controls, func: "onPointerMove" });
                //scope.domElement.addEventListener( 'pointerup', scope.onPointerUp );
                //DD2022.eventManager.addAction({ type: "up", target: this.decor3d.controls, func: "onPointerUp" });
            }


        }
    }
    registerUp(e) {
        DD2022.eventManager.removeAction({ type: "move", target: this, func: "registerMove" });
        if (e.clientX == this.clientCoordsX && e.clientY == this.clientCoordsY) {
            // console.log("straight hit, select it");
            let testObj = this.manager.getFocusGroup(e.clientX, e.clientY);
            let test = null;
            let detach = false;
            if (testObj != null) {
                if (testObj.object != null) {
                    test = testObj.object;
                    this.dropTarget = testObj.group;
                    detach = true;
                } else {
                    this.reattachObject(); // reattach any surface product
                    test = testObj.group;
                    this.dropTarget = null;
                }
            }
            console.log("SELECTED", testObj);

            if (test != null && test == this.currentTarget) {

                this.highlightSelected();
                return;
            };


            if (test) {

                //detach from object
                if (testObj.object && testObj.group != testObj.object) {
                    // this.currentTarget.parent.remove(this.currentTarget);
                    this.decor3d.decorLayer.attach(this.currentTarget);
                }
                this.selectObject(test);
            } else {
                let roomObj = this.getRoomObject(e);
                if (roomObj && !roomObj.isRoom && roomObj.snap != "env") {
                    this.selectObject(roomObj);
                } else {
                    this.endEdit();
                }

            }
        }
    }

    selectObject(obj) {
        if (DD2022.shiftkey) {
            if (this.currentTarget != null) {
                this.multiSelected.push(this.currentTarget);
            }
            this.multiSelected.push(obj);
            this.currentTarget = obj;
            this.highlightSelected();
            this.currentTarget = null;
        } else {
            this.lowlight();
            this.currentTarget = obj;
            this.startEdit();
            this.currentWall = null;
        }
    }

    getRoomObject(e) {
        if (this.decor3d.envLayer.children.length < 1) return null;
        var rect = this.decor3d.container.getBoundingClientRect();
        this.mouse.x = (e.clientX / rect.width) * 2 - 1;
        this.mouse.y = - (e.clientY / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.decor3d.envLayer.children[0].accessoryLayer.children, true);

        if (intersects.length > 0) {

            let obj = intersects[0].object;
            let depth = 10; //prevent loop from continuing efter 10 levels
            while (obj.parent) {
                //select accessory
                if (obj.parent.isWallMounted) { //for example a window or door
                    return obj.parent;
                } else {
                    obj = obj.parent;
                }
                depth -= 1;
                if (depth < 1) {
                    return null
                };
            }

        }

    }
    startEdit() {
        console.log("editing ROom PLanner", this.currentTarget);
        this.rect = this.decor3d.container.getBoundingClientRect(); //calculate once

        this.highlightSelected();
        this.decor3d.controls.enabled = false;
        this.camera = this.decor3d.camera;

        //Array for hittesting all surfaces not in currentTarget
        this.hitObjArray = this.decor3d.decorLayer.children.filter(value => {
            return value != this.currentTarget;
        });
        this.hitObjArray.concat(this.decor3d.envLayer.children);

        if (this.dragControls) {
            this.dragControls.setTarget(this.currentTarget);
            this.dragControls.activate();
            this.decor3d.camera.updateProjectionMatrix();
            this.dragControls.setCamera(this.decor3d.camera);


        } else {
            //add move and rotate tools
            this.dragControls = new DecorDragControls(this.currentTarget, this.decor3d.camera, this.decor3d.renderer.domElement, this.updateDrag, this.limitReset);
        }


        if (this.currentTarget.myDragPlane) {
            this.dragControls.setPlane(this.currentTarget.myDragPlane);
            this.dragControls.addEventListener('dragend', this.dragEnded.bind(this));

        } else {
            this.dragControls.resetPlane();
            this.dragControls.rotationEnabled(true);
        }
        if (this.currentTarget.snap == "wall") {
            //  this.dragControls.rotationEnabled(false);
            // if(DD2022.cadMode) this.dragControls.deactivate();
        }
        this.buildWallArray();
        this.buildObstructionArray();

        /* if(this.dragControls._listeners == undefined){
         
             this.dragControls.addEventListener('drag', this.collisionTest.bind(this));
             this.dragControls.addEventListener('wheel', this.resetLimits.bind(this));
 
         } */

        // console.log(this.dragControls._listeners.drag);
        DD2022.setMenuRefresh(true);
        DD2022.loadMenu(this.currentTarget);
        this.resetLimits();

        if (this.currentTarget.snap == 'wall' && this.currentTarget.classtype.substring(0, 8) == "WineRack") {
            this.registerSnapPoints(this.currentTarget);
        }
        if (this.currentTarget.snap == 'wall') {
            this.buildWallArray();
            this.objectSnapPoints = this.currentTarget.getWallSnaps();
        }

        setTimeout(this.drawStaticDimensions.bind(this),100);



    }
    drawStaticDimensions(){
        this.drawObjectDimension();
        render();
    }
    registerSnapPoints(object) {
        this.snapPoints = [];
        var points;
        var pos = new THREE.Vector3();
        for (var i = 0; i < this.decor3d.decorLayer.children.length; i++) {
            let winerack = this.decor3d.decorLayer.children[i];
            if (winerack != object && winerack.classtype.substring(0, 8) == "WineRack") {

                points = winerack.getWallSnaps();
                for (var p = 0; p < points.length; p++) {
                    points[p].getWorldPosition(pos);
                    // check if point is on wall
                    // if(this.isOnWall(pos)){
                    this.snapPoints.push(new THREE.Vector3().copy(pos));
                    //}
                }
            }
        }



        // targetObject = object;


    }
    buildWallArray() {
        this.wallArray = [];
        if (this.decor3d.envLayer.children.length > 0) {
            for (var w = 0; w < this.decor3d.envLayer.children[0].wallArray.length; w++) {
                this.wallArray.push(this.decor3d.envLayer.children[0].wallArray[w].snapSurface);
            }
        }
        // add room corner/floor/cieling snaps
        if (this.decor3d.envLayer.children.length > 0 && this.decor3d.envLayer.children[0].classtype == "DynamicRoom") {
            var pos = new THREE.Vector3();
            for (var t = 0; t < this.decor3d.envLayer.children[0].pointArray.length; t++) {
                this.decor3d.envLayer.children[0].pointArray[t].getWorldPosition(pos);
                this.snapPoints.push(new THREE.Vector3().copy(pos));
            }
            //snap for room height
            this.snapPoints.push(new THREE.Vector3(0, this.decor3d.envLayer.children[0].currentHeight, 0));

            // add any accessories that contains _aswall
            for (var p = 0; p < this.decor3d.envLayer.children[0].accessoryLayer.children.length; p++) {
                this.wallArray = this.wallArray.concat(this.decor3d.envLayer.children[0].accessoryLayer.children[p].wallArray);
            }
        }

    }
    resetLimits() {
        //reset collision

        this.maxX = this.maxZ = 1000;
        this.minX = this.minZ = -1000;
    }
    dragEnded(target) {
        console.log("Drag ended");
        this.decor3d.envLayer.children[0].createHoles();
        //target.endEdit();
        this.currentWall = null;


    }
    reattachObject() {
        //reattach object

        //get object from dropTarget
        let obj = this.dropTarget;
        let scope = this;
        if (this.dropTarget && this.currentTarget) {
            let depth = 10;
            while (obj.parent) {

                if (obj.parent.parent == this.decor3d.decorLayer) {
                    let group = obj.parent;
                    group.accessoryLayer.attach(this.currentTarget);
                    //   console.log("positions", group.position, this.currentTarget.position, this.currentTarget.position.sub(group.position));

                    // this.currentTarget.position.sub(group.position)
                    //this.currentTarget.matrix.sub(group.matrix);
                    render();
                    return;
                } else {
                    obj = obj.parent;
                }
                depth -= 1;
                if (depth < 1) { return null };
            }
            scope.dropTarget = null;
            render();
        } else {
            return;
        }
    }
    endEdit() {
        console.log("ending", this.dropTarget);

        var l = this.multiSelected.length;
        if (l > 0) {
            var i
            for (i = 0; i < l; i++) {
                this.currentTarget = this.multiSelected[i];
                this.lowlight();
            }
            this.multiSelected = [];
            DD2022.resetDuplicationCount();
        }
        this.lowlight();
        if (this.dragControls) {
            this.dragControls.deactivate();
        }
        this.decor3d.controls.enabled = true;
        if (this.dropTarget) this.reattachObject();



        this.currentTarget = null;

    }
    highlightSelected() {
        this.currentTarget.traverse(function (obj) {
            if (obj.isMesh && obj.material.emissive && obj.parent.snap != "bot" && obj.snap != "bot") {
                // MaterialManager.checkMaterial(obj);
                obj.material.emissive.set(0x3a2600);
            }
        })
        this.currentTarget.createWallSnaps();

        render();
    }
    lowlight() {
        if (this.currentTarget) {
            this.currentTarget.traverse(function (obj) {
                if (obj.isMesh && obj.material.emissive) {
                    //  MaterialManager.checkMaterial(obj);
                    obj.material.emissive.set(0x000000);

                }
            })
            //this.currentTarget.removeWallSnaps();
            render();
        }
    }
    setTarget(target) {
        this.currentTarget = target;
    }
    collisionTest(obj, raycaster=null) {

        if(raycaster != null){ 
            this.raycaster = raycaster;
            obj = {object:this.currentTarget};
        }else{

            this.lastEvent = this.dragControls.getLastEvent();
            this.mouse.x = (this.lastEvent.clientX / this.rect.width) * 2 - 1;
            this.mouse.y = - (this.lastEvent.clientY / this.rect.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
        }
        console.log(obj);
        if (obj.object.snap == "wall") {


            this.wallIntersects = this.raycaster.intersectObjects(this.wallArray, true);
            console.log("walls", this.wallIntersects, this.wallArray);
            this.len = this.wallIntersects.length;
            if (this.len > 0) {

                for (this.iter = 0; this.iter < this.len; this.iter++) {



                    if (this.wallIntersects[this.iter].object.name.substr(0, 7) == "_aswall") {
                        this.dragControls.rotationEnabled(false); //prevent rotation

                        // calculate plane from face
                        if (this.wallIntersects[this.iter].object != this.currentWall) {
                            this.currentWall = this.wallIntersects[this.iter].object;


                            this.normalMatrix.getNormalMatrix(this.wallIntersects[this.iter].object.matrixWorld);
                            this.worldNormal.copy(this.wallIntersects[this.iter].face.normal).applyMatrix3(this.normalMatrix).normalize();
                            this.pl.setFromNormalAndCoplanarPoint(this.worldNormal, this.wallIntersects[this.iter].point);
                            this.dragControls.setPlane(this.pl);
                            obj.object.position.x = obj.object.position.z = obj.object.position.y = 0;
                            // obj.object.lookAt(hit.face.normal);
                            obj.object.lookAt(this.worldNormal);
                        }
                        obj.object.position.copy(this.wallIntersects[this.iter].point);
                        //this.drawWallObjectDimension(obj.object);
                        break;
                    }

                };

            } else {
                if(this.dragControls){
                this.dragControls.setPlane(this.YPLANE);
                this.dragControls.rotationEnabled(true);
                obj.object.position.y = 0;
                this.dropTarget = null;
                this.dragControls.resetOffset();
                }
                obj.object.position.y = 0;
                if (this.raycaster.ray.intersectPlane(this.YPLANE, this.worldPos)) {

					obj.object.position.copy(this.worldPos);

				}



            }

            this.closestSnap(obj.object);

            obj.object.position.x -= this.px;
            obj.object.position.y -= this.py;
            obj.object.position.z -= this.pz;
            // this.drawWallObjectDimension(obj.object);
            if (DD2022.cadMode) this.drawObjectDimension();
            return;


        }


        //EXPERIMENTAL//////////////////////////////////////////////////////////////
        if (obj.object.snap_type == "surface") {

            this.surfaceIntersects = this.raycaster.intersectObjects(this.hitObjArray, true);
            //         console.log(intersects, e);
            if (this.surfaceIntersects.length > 0) {
                this.surfaceIntersects[0];
                // console.log(hit.object);
                // this.dragControls.rotationEnabled(false); //prevent rotation

                // calculate plane from face
                if (this.surfaceIntersects[0].object != this.currentWall) {
                    this.currentWall = this.surfaceIntersects[0].object;

                    this.dropTarget = this.surfaceIntersects[0].object;
                    this.normalMatrix.getNormalMatrix(this.surfaceIntersects[0].object.matrixWorld);
                    this.worldNormal.copy(this.surfaceIntersects[0].face.normal).applyMatrix3(this.normalMatrix).normalize();
                    this.pl.setFromNormalAndCoplanarPoint(this.worldNormal, this.surfaceIntersects[0].point);
                    this.dragControls.setPlane(this.pl);
                    // obj.object.position.x = obj.object.position.z = obj.object.position.y = 0;
                    // obj.object.lookAt(hit.face.normal);
                }
                obj.object.position.copy(this.surfaceIntersects[0].point);


                return;
            } else {
                this.dragControls.setPlane(this.YPLANE);
                obj.object.position.y = 0;
                this.dropTarget = null;
                this.dragControls.resetOffset();
                //obj.object.quaternion.copy(this.noRotate); 
            }
            return;
        }

        ////////////////////////////////////////////////////////////////////////////
        //Keep within bounds of wall

        if (this.decor3d.envLayer.children.length < 1) return;
        if (this.decor3d.envLayer.children[0].pointArray) {
            this.points = this.decor3d.envLayer.children[0].pointArray;
            obj.object.backSnap.getWorldPosition(this.snapPos);
            //  this.snapPos.x += Math.sin(this.raySize.z/2

            this.len = this.points.length;
            for (var i = 0; i < this.points.length - 1; i++) {

                // frontal rotation snap
                obj.object.frontSnap.getWorldPosition(this.frontPos);
                this.vec = this.getClosestPoint(this.points[i].position, this.points[i + 1].position, this.frontPos);
                this.dist = this.vec.distanceTo(this.frontPos);
                if (this.dist < this.snapDistance) {
                    obj.object.quaternion.copy(this.noRotate);
                    obj.object.rotateY(this.radianFrom2Points(this.points[i].position, this.points[i + 1].position));
                }

                // back snap
                this.vec = this.getClosestPoint(this.points[i].position, this.points[i + 1].position, this.snapPos);
                this.dist = this.vec.distanceTo(this.snapPos);


                if (this.dist < this.snapDistance) {
                    obj.object.quaternion.copy(this.noRotate);
                    obj.object.rotateY(this.radianFrom2Points(this.points[i].position, this.points[i + 1].position));
                    //offset x and z compared to object position
                    this.vec.x += (obj.object.position.x - this.snapPos.x);
                    this.vec.z += (obj.object.position.z - this.snapPos.z);
                    obj.object.position.copy(this.vec);

                    //check for limits along new x axis (snap to ends)
                    render();
                    obj.object.rightSnap.getWorldPosition(this.rightPos);
                    this.rdist = this.points[i + 1].position.distanceTo(this.rightPos);
                    if (this.rdist < this.snapDistance) {
                        //move to touch wall
                        obj.object.position.x += (this.points[i + 1].position.x - this.rightPos.x);
                        obj.object.position.z += (this.points[i + 1].position.z - this.rightPos.z);
                    }
                    obj.object.leftSnap.getWorldPosition(this.leftPos);
                    this.ldist = this.points[i].position.distanceTo(this.leftPos);
                    if (this.ldist < this.snapDistance) {
                        //move to touch wall
                        obj.object.position.x += (this.points[i].position.x - this.leftPos.x);
                        obj.object.position.z += (this.points[i].position.z - this.leftPos.z);
                        //console.log("dist:",rdist, "xcomp:", points[i+1].position.x - this.rightPos.x, "zcomp:", points[i+1].position.z - this.rightPos.z);
                    }
                }




            }

            // default:
            // break;
            //}
            this.drawObjectDimension();
        }
    }
    closestSnap() {
        this.cx = Infinity;
        this.cy = Infinity;
        this.cz = Infinity;
        this.px = 0;
        this.py = 0;
        this.pz = 0;
        // get the three closest points in x y and z
        for (var i = 0; i < this.objectSnapPoints.length; i++) {
            this.objectSnapPoints[i].getWorldPosition(this.worldPos);
            for (var j = 0; j < this.snapPoints.length; j++) {
                //don't test against snap in same position
                if (j % 4 == i) continue;

                this.tx = Math.abs(this.snapPoints[j].x - this.worldPos.x);
                if (this.tx < this.cx && this.tx < this.snapTolerance) {
                    this.cx = this.tx;
                    this.px = this.worldPos.x - this.snapPoints[j].x;
                }
                this.ty = Math.abs(this.snapPoints[j].y - this.worldPos.y);
                if (this.ty < this.cy && this.ty < this.snapTolerance) {
                    this.cy = this.ty;
                    this.py = this.worldPos.y - this.snapPoints[j].y;
                }
                this.tz = Math.abs(this.snapPoints[j].z - this.worldPos.z);
                if (this.tz < this.cz && this.tz < this.snapTolerance) {
                    this.cz = this.tz;
                    this.pz = this.worldPos.z - this.snapPoints[j].z;
                }
            }
        }


    }
    clearDrawLayer() {
        while (this.decor3d.drawLayer.children.length > 0) {
            this.decor3d.drawLayer.remove(this.decor3d.drawLayer.children[this.decor3d.drawLayer.children.length - 1]);
        }
    }
    drawObjectDimension() {
        if (!DD2022.cadMode) return;
        if (this.decor3d.envLayer.children.length < 1) return;
        if (!this.currentTarget) return;
        this.clearDrawLayer();

        $("#dimensions").html("");


        //cast a ray from the center of the object 

        this.bbox.setFromObject(this.currentTarget);
        this.bbox.getCenter(this.rayCenter);
        this.bbox.getSize(this.raySize);
        this.rayCenter.y = 0.01; //check at ground level

        // X negative direction 0
        this.rayOffset.x = this.rayCenter.x - (this.raySize.x / 2);
        this.rayOffset.z = this.rayCenter.z;
        this.rayPos.y = 0.01;
        this.rayDirection.x = -1;
        this.rayDirection.y = 0;
        this.rayDirection.z = 0;
        this.collisionRay.set(this.rayOffset, this.rayDirection);
        this.collisions = this.collisionRay.intersectObjects(this.obstructionArray, false);
        if (this.collisions.length > 0) {

            //this.decor3d.drawLayer.add(new DimensionLine(this.rayOffset, collisions[0].point, 0x008abd, 0.1, 0.2));
            this.decor3d.drawLayer.add(this.dimLine0);

            this.dimLine0.redraw(this.rayOffset, this.collisions[0].point);

            this.vector3d.x = this.rayOffset.x + ((this.collisions[0].point.x - this.rayOffset.x) / 2);
            this.vector3d.z = this.rayOffset.z;
            this.vector = this.screenXY(this.vector3d);
            this.createDimensionInput(Number(this.vector.x - 15), Number(this.vector.y - 14), "negx", Math.round(this.collisions[0].distance * 100));
            // $("#dimensions").append("<div style='position:absolute;left:" + Number(this.vector.x - 15) + "px;top:" + Number(this.vector.y - 6) + "px'><span><input type='text' tabindex='" + 0 + "' onfocus='DD2022.decorRoomPlanner.makeNumeric(event)' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='negx' value='" + Math.round(this.collisions[0].distance * 100) + ' cm' + "' ></div>");
            this.objDistances[0] = this.collisions[0].distance;
        }
        // X positive 1
        this.rayOffset.x = this.rayCenter.x + (this.raySize.x / 2);
        this.rayPos.y = 0.01;
        this.rayDirection.x = 1;
        this.rayDirection.y = 0;
        this.rayDirection.z = 0;
        this.collisionRay.set(this.rayOffset, this.rayDirection);
        this.collisions = this.collisionRay.intersectObjects(this.obstructionArray, false);
        if (this.collisions.length > 0) {

            //this.decor3d.drawLayer.add(new DimensionLine(this.rayOffset, collisions[0].point, 0x008abd, 0.1, 0.2));
            this.decor3d.drawLayer.add(this.dimLine1);
            this.dimLine1.redraw(this.rayOffset, this.collisions[0].point);
            this.vector3d.x = this.rayOffset.x + ((this.collisions[0].point.x - this.rayOffset.x) / 2);
            this.vector3d.z = this.rayOffset.z;
            this.vector = this.screenXY(this.vector3d);
            this.createDimensionInput(Number(this.vector.x - 15), Number(this.vector.y - 14), "posx", Math.round(this.collisions[0].distance * 100))
            // $("#dimensions").append("<div style='position:absolute;left:" + Number(this.vector.x - 15) + "px;top:" + Number(this.vector.y - 6) + "px'><input type='text' tabindex='" + 1 + "' onfocus='DD2022.decorRoomPlanner.makeNumeric(event)' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='posx' value='" +  + ' cm' + "' ></div>");
            this.objDistances[1] = this.collisions[0].distance;
        }
        // Z negative direction
        this.rayOffset.x = this.rayCenter.x;
        this.rayOffset.z = this.rayCenter.z + this.raySize.z / 2;
        this.rayPos.y = 0.01;
        this.rayDirection.x = 0;
        this.rayDirection.y = 0;
        this.rayDirection.z = 1;
        this.collisionRay.set(this.rayOffset, this.rayDirection);
        this.collisions = this.collisionRay.intersectObjects(this.obstructionArray, false);
        if (this.collisions.length > 0) {

            //this.decor3d.drawLayer.add(new DimensionLine(this.rayOffset, collisions[0].point, 0x008abd, 0.1, 0.2));
            this.decor3d.drawLayer.add(this.dimLine2);
            this.dimLine2.redraw(this.rayOffset, this.collisions[0].point, true);
            this.vector3d.x = this.rayOffset.x
            this.vector3d.z = this.rayOffset.z + ((this.collisions[0].point.z - this.rayOffset.z) / 2);
            this.vector = this.screenXY(this.vector3d);
            //  $("#dimensions").append("<div style='position:absolute;left:" + Number(this.vector.x - 15) + "px;top:" + Number(this.vector.y - 6) + "px'><input type='text' tabindex='" + 0 + "' onfocus='DD2022.decorRoomPlanner.makeNumeric(event)' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='posz' value='" + Math.round(this.collisions[0].distance * 100) + ' cm' + "' ></div>");
            this.createDimensionInput(Number(this.vector.x + 5), Number(this.vector.y - 6), "posz", Math.round(this.collisions[0].distance * 100))
            this.objDistances[2] = this.collisions[0].distance;
        }
        // Z positive
        this.rayOffset.z = this.rayCenter.z - this.raySize.z / 2;
        this.rayPos.y = 0.01;
        this.rayDirection.x = 0;
        this.rayDirection.y = 0;
        this.rayDirection.z = -1;
        this.collisionRay.set(this.rayOffset, this.rayDirection);
        this.collisions = this.collisionRay.intersectObjects(this.obstructionArray, false);
        if (this.collisions.length > 0) {
            this.decor3d.drawLayer.add(this.dimLine3);
            this.dimLine3.redraw(this.rayOffset, this.collisions[0].point, true)
            this.vector3d.x = this.rayOffset.x
            this.vector3d.z = this.rayOffset.z + ((this.collisions[0].point.z - this.rayOffset.z) / 2);
            this.vector = this.screenXY(this.vector3d);
            //   $("#dimensions").append("<div style='position:absolute;left:" + Number(this.vector.x - 15) + "px;top:" + Number(this.vector.y - 6) + "px'><input type='text' tabindex='" + 0 + "' onfocus='DD2022.decorRoomPlanner.makeNumeric(event)' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='negz' value='" + Math.round(this.collisions[0].distance * 100) + ' cm' + "' ></div>");
            this.createDimensionInput(Number(this.vector.x + 5), Number(this.vector.y - 6), "negz", Math.round(this.collisions[0].distance * 100))
            this.objDistances[3] = this.collisions[0].distance;
        }


        /* this.currentTarget.rightCenterSnap.getWorldPosition(this.arrowEnd);
         this.arrowStart.copy(this.arrowEnd);
         this.arrowStart.x -= 1;
         this.decor3d.drawLayer.add(new DimensionLine(this.arrowStart, this.arrowEnd, 0x008abd, 0.1, 0.2));*/
    }
    createDimensionInput(left, top, id, value) {
        $("#dimensions").append("<div style='position:absolute;left:" + left + "px;top:" + top + "px'><span style='cursor:pointer; pointer-events:all' onclick='DD2022.decorRoomPlanner.makeDimensionActive(event)' id='l_" + id + "'>" + value + " cm</span><input style='display:none' type='text' tabindex='" + 0 + "' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='" + id + "' value='" + value + "' ></div>");
    }
    makeDimensionActive(event) {
        console.log("event", event);
        event.target.style.display = 'none';
        let inputid = event.target.id.substr(2);
        $("#" + inputid).css("display", "block");
        $("#" + inputid).focus();
        $("#" + inputid).select();
    }
    drawWallObjectDimension(obj) {
        if (!DD2022.showDimensions) return;
        if (this.decor3d.envLayer.children.length < 1) return;
        while (this.decor3d.drawLayer.children.length > 0) {
            this.decor3d.drawLayer.remove(this.decor3d.drawLayer.children[this.decor3d.drawLayer.children.length - 1]);
        }

        $("#dimensions").html("");


        //cast a ray from the center of the object 

        this.bbox.setFromObject(obj);
        this.bbox.getCenter(this.rayCenter);
        this.bbox.getSize(this.raySize);
        this.rayCenter.y = 0.01; //check at ground level

        // object X negative direction 0
        this.rayOffset.x = this.rayCenter.x - (this.raySize.x / 2);
        this.rayOffset.z = this.rayCenter.z;

        obj.frontSnap.getWorldPosition(this.rayCenter);
        //get the left hand direction
        obj.frontLeftSnap.getWorldPosition(this.leftPos);
        obj.frontRightSnap.getWorldPosition(this.rightPos);

        this.rayDirection = this.leftPos.clone().sub(this.rightPos).normalize();

        this.rayPos.y = 0.01;

        this.collisionRay.set(this.leftPos, this.rayDirection);
        this.collisions = this.collisionRay.intersectObjects(this.wallArray, false);
        if (this.collisions.length > 0) {

            //this.decor3d.drawLayer.add(new DimensionLine(this.rayOffset, collisions[0].point, 0x008abd, 0.1, 0.2));
            this.decor3d.drawLayer.add(this.dimLine0);
            this.dimLine0.redraw(this.leftPos, this.collisions[0].point);

            this.vector3d.x = this.leftPos.x + ((this.collisions[0].point.x - this.leftPos.x) / 2);
            this.vector3d.z = this.leftPos.z + ((this.collisions[0].point.z - this.leftPos.z) / 2);
            this.vector3d.y = this.leftPos.y;
            this.vector = this.screenXY(this.vector3d);
            //   $("#dimensions").append("<div style='position:absolute;left:" + Number(this.vector.x - 15) + "px;top:" + Number(this.vector.y - 6) + "px'><input type='text' tabindex='" + 0 + "' onfocus='DD2022.decorRoomPlanner.makeNumeric(event)' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='negz' value='" + Math.round(this.collisions[0].distance * 100) + ' cm' + "' ></div>");
            this.createDimensionInput(Number(this.vector.x - 5), Number(this.vector.y - 14), "left", Math.round(this.collisions[0].distance * 100))
            this.objDistances[0] = this.collisions[0].distance;
        }

        // X positive 1 (local right-hand direction)
        this.snapPos = this.rightPos.clone().sub(this.leftPos).normalize();
        this.collisionRay.set(this.rightPos, this.snapPos);
        this.collisions = this.collisionRay.intersectObjects(this.wallArray, false);
        if (this.collisions.length > 0) {

            this.decor3d.drawLayer.add(this.dimLine1);
            this.dimLine1.redraw(this.rightPos, this.collisions[0].point);
            this.vector3d.x = this.rightPos.x + ((this.collisions[0].point.x - this.rightPos.x) / 2);
            this.vector3d.z = this.rightPos.z + ((this.collisions[0].point.z - this.rightPos.z) / 2);
            this.vector3d.y = this.rightPos.y;
            this.vector = this.screenXY(this.vector3d);
            //   $("#dimensions").append("<div style='position:absolute;left:" + Number(this.vector.x - 15) + "px;top:" + Number(this.vector.y - 6) + "px'><input type='text' tabindex='" + 0 + "' onfocus='DD2022.decorRoomPlanner.makeNumeric(event)' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='negz' value='" + Math.round(this.collisions[0].distance * 100) + ' cm' + "' ></div>");
            this.createDimensionInput(Number(this.vector.x - 5), Number(this.vector.y - 14), "right", Math.round(this.collisions[0].distance * 100))
            this.objDistances[1] = this.collisions[0].distance;
        }
        // Y negative direction
        obj.frontSnap.getWorldPosition(this.rayCenter);
        this.rayDirection.copy(this.rayCenter);
        this.rayDirection.y = 0;

        this.decor3d.drawLayer.add(this.dimLine2);
        this.dimLine2.redraw(this.rayCenter, this.rayDirection);

        this.vector3d.x = this.rayCenter.x;
        this.vector3d.z = this.rayCenter.z;
        this.vector3d.y = this.rayCenter.y / 2;
        this.vector = this.screenXY(this.vector3d);
        //   $("#dimensions").append("<div style='position:absolute;left:" + Number(this.vector.x - 15) + "px;top:" + Number(this.vector.y - 6) + "px'><input type='text' tabindex='" + 0 + "' onfocus='DD2022.decorRoomPlanner.makeNumeric(event)' onfocusout='DD2022.decorRoomPlanner.changeLengthOut(event)' onkeydown='DD2022.decorRoomPlanner.changeLengthKey(event)' id='negz' value='" + Math.round(this.collisions[0].distance * 100) + ' cm' + "' ></div>");
        this.createDimensionInput(Number(this.vector.x + 15), Number(this.vector.y - 6), "up", Math.round(this.rayCenter.y * 100));



    }
    clearDimensions() {
        $("#dimensions").html("");
    }
    makeNumeric(e) {
        e.target.value = e.target.value.substr(0, e.target.value.length - 3);
    }
    changeLengthOut(e) {

        // this.changeDistance(e.target);

    }
    changeLengthKey(e) {
        if (e.keyCode == 9 || e.keyCode == 13) {
            this.changeDistance(e.target);
        }
    }
    changeDistance(target) {
        console.log("changing distance", target.id);
        let dist = target.value / 100;
        let shift;
        switch (target.id) {

            case "negx":
                shift = dist - this.objDistances[0];
                this.currentTarget.position.x += shift;
                break;

            case "posx":
                shift = dist - this.objDistances[1];
                this.currentTarget.position.x -= shift;
                break;

            case "posz":
                shift = dist - this.objDistances[2];
                this.currentTarget.position.z -= shift;
                break;

            case "negz":
                shift = dist - this.objDistances[3];
                this.currentTarget.position.z += shift;
                break;
            case "left":
                shift = dist - this.objDistances[0];
                console.log("shift", shift);
                this.currentTarget.translateX(shift);
                break;
            case "right":
                shift = dist - this.objDistances[1];
                console.log("shift", shift);
                this.currentTarget.translateX(-shift);
                break;
            case "up":
                this.currentTarget.position.y = dist;
                break;

            default:
                break;
        }
        /* if (this.currentTarget.snap == "wall") {
             if(DD2022.showDimensions) this.drawWallObjectDimension(this.currentTarget);
             this.decor3d.envLayer.children[0].createHoles();
             
         }else{
             if(DD2022.showDimensions) this.drawObjectDimension();
         } */
        if (DD2022.showDimensions) this.drawObjectDimension();
        render();
    }
    scaleTexts(value) {
        console.log("Scaling texts", value);
        let a = value / 6;
        for (var i = 0; i < this.dimLines.length; i++) {
            this.dimLines[i].scaleText(a);
        }
    }
    getClosestPoint(A, B, P) {
        var segmentClamp = true;
        // P is a Vector3, of which we use x and z (as appose to y)
        var AP = new THREE.Vector2(P.x - A.x, P.z - A.z);
        var AB = new THREE.Vector2(B.x - A.x, B.z - A.z);
        var ab2 = (AB.x * AB.x) + (AB.y * AB.y);
        var ap_ab = (AP.x * AB.x) + (AP.y * AB.y);
        var t = ap_ab / ab2;

        if (segmentClamp) {
            if (t < 0.0) {
                t = 0.0;
            } else if (t > 1.0) {
                t = 1.0;
            }

        }
        return new THREE.Vector3(A.x + AB.x * t, 0, A.z + AB.y * t);
    }
    radianFrom2Points(p1, p2) { // a pair of 3D points
        // move the vector to 0,0
        // working in the XZ plane, so ignore Y
        var vectorX = p2.x - p1.x;
        var vectorY = -(p2.z - p1.z); // "z" minus to comply with XY
        var tangent = vectorY / vectorX;

        var angle = Math.atan(tangent);
        // convert to 0-180
        // first quadrant, no adjustment

        //second quadrant
        if (vectorX < 0 && vectorY >= 0) {
            angle = (Math.PI) + angle; //angle between 90 and 180

        }
        //third quadrant
        if (vectorX < 0 && vectorY < 0) {
            angle = (Math.PI) + angle; //angle between 180 and 270 (pi x 1.5)
        }
        //forth quadrant
        if (vectorX >= 0 && vectorY < 0) {
            angle = (Math.PI * 2) + angle; //angle between 270 and 360 . Plussing a minus value
        }


        return angle;

    }
    screenXY(objPosition) {

        var vector = new THREE.Vector3();
        vector.copy(objPosition);
        /*var windowWidth = window.innerWidth;
        var minWidth = 1280;
      
        if(windowWidth < minWidth) {
          windowWidth = minWidth;
        }*/

        var widthHalf = this.decor3d.renderer.domElement.width / 2;
        var heightHalf = this.decor3d.renderer.domElement.height / 2;

        vector.project(this.decor3d.camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = - (vector.y * heightHalf) + heightHalf;
        vector.z = 0;

        return vector;

    }



}

export default DecorRoomPlanner


