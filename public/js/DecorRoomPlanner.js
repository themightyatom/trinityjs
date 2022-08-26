
import * as THREE from '/three/build/three.module.js';
import { DecorDragControls } from '/js/DecorDragControls.js';
import DecorLogin from '/js/DecorLogin.js';
import MaterialManager from '/js/MaterialManager.js';



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
        this.rayHits = [0, 0, 0, 0];
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
    /* loadProductMenu() {
         let lang = ltvs__lang;
         ltvs_menuHolder.classList.add("cover-full");
         fetch(ltvs__source + '/clients/productmenu/' + lang)
             .then(response => response.json())
             .then(data => {
                 let htmlStr = "<div class='cat-but' onmousedown='DecorRoomPlanner.removeUI()'><img style='box-shadow:none;' width='24px' height='24px' src='" + ltvs__source + "/icons/arrow_back_black_24dp.svg'></div>";
                 data.cats.forEach(element => {
                     htmlStr += "<div class='cat-con'><div class='pallet-item-container' onmousedown='DecorRoomPlanner.openCat(" + element.id + ")'><img src='" + ltvs__source + "/thumbs/categories/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div></div>";
                 });
 
                 ltvs_menuHolder.innerHTML = htmlStr;
             });
     }
     openCat(id) {
 
         ltvs_menuHolder.classList.add("cover-full");
         fetch(ltvs__source + '/clients/category/' + id + '/none')
             .then(response => response.json())
             .then(data => {
                 ltvs_menuHolder.innerHTML = "";
 
                 const closeBut = document.createElement("div");
                 closeBut.onmousedown = this.loadProductMenu.bind(this);
                 closeBut.classList.add('cat-but');
                 closeBut.innerHTML = "<img style='box-shadow:none;' width='24px' height='24px' src='" + ltvs__source + "/icons/arrow_back_black_24dp.svg'>";
                 ltvs_menuHolder.appendChild(closeBut);
                 const items = document.createElement("div");
                 ltvs_menuHolder.appendChild(items);
                 let htmlStr = "";
                 data.models.forEach(element => {
                     if (element.snap_type == "environment") {
                         // htmlStr += "<div class='pallet-item-container' onmousedown= \"DecorRoomPlanner.loadEnvironment('" + element.model_class + "','" + element.id + "','"+ element.snap +"','"+ element.model +"','" + element.sku + "')\"><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id +".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                         htmlStr += "<div class='pallet-item-container' onmousedown='DecorRoomPlanner.loadEnvironment(" + element.id + ")'><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                     } else {
                         htmlStr += "<div class='pallet-item-container' onmousedown='DecorRoomPlanner.loadNewModel(" + element.id + ")'><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                     }
                     // htmlStr += "<div class='model-but' style='background-image:url(\""+ ltvs__source + "/thumbs/models/" + element.id +".png\")' onmousedown='DecorRoomPlanner.loadNewModel(" + element.id +")'>" + element.title + "</div>";
                 });
                 items.innerHTML = htmlStr;
 
             })
     }*/
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
        if(DD2022.shiftkey){
            if(this.currentTarget != null){
                this.multiSelected.push(this.currentTarget);
            }
            this.multiSelected.push(obj);
            this.currentTarget = obj;
            this.highlightSelected();
            this.currentTarget = null;
        }else{
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
        }

        /* if(this.dragControls._listeners == undefined){
         
             this.dragControls.addEventListener('drag', this.collisionTest.bind(this));
             this.dragControls.addEventListener('wheel', this.resetLimits.bind(this));
 
         } */

        // console.log(this.dragControls._listeners.drag);
        DD2022.setMenuRefresh(true);
        DD2022.loadMenu(this.currentTarget);
        this.resetLimits();

        if (this.currentTarget.snap == 'wall' && this.currentTarget.classtype.substring(0,8) == "WineRack"){
            this.registerSnapPoints(this.currentTarget);
        } 
        if (this.currentTarget.snap == 'wall'){
            this.buildWallArray();
            this.objectSnapPoints = this.currentTarget.getWallSnaps();
        } 
        


    }
    registerSnapPoints(object) {
        this.snapPoints = [];
        var points;
        var pos = new THREE.Vector3();
        for (var i = 0; i < this.decor3d.decorLayer.children.length; i++) {
            let winerack = this.decor3d.decorLayer.children[i];
            if (winerack != object && winerack.classtype.substring(0,8) == "WineRack") {

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
        if(l > 0){
            var i
            for(i=0;i<l;i++){
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
            if (obj.isMesh && obj.material.emissive && obj.parent.snap != "bot") {
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
    collisionTest(obj) {
        
        this.lastEvent = this.dragControls.getLastEvent();
        this.mouse.x = (this.lastEvent.clientX / this.rect.width) * 2 - 1;
        this.mouse.y = - (this.lastEvent.clientY / this.rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
       
        if (obj.object.snap == "wall") {


            this.wallIntersects = this.raycaster.intersectObjects(this.wallArray, true);
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
                        break;
                    }

                };

            } else {
                this.dragControls.setPlane(this.YPLANE);
                this.dragControls.rotationEnabled(true);
                obj.object.position.y = 0;
                this.dropTarget = null;
                this.dragControls.resetOffset();

            }

            this.closestSnap(obj.object);

            obj.object.position.x -= this.px;
            obj.object.position.y -= this.py;
            obj.object.position.z -= this.pz;
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



}

export default DecorRoomPlanner


