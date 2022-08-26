
import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';
import ControlPoint from '/js/ControlPoint.js';

import Wall from "/js/Wall.js";
import SnapMaterialDouble from '/js/SnapMaterialDouble.js';
import SnapMaterial from '/js/SnapMaterial.js';
import MaterialManager from '/js/MaterialManager.js';


const bluemat = new THREE.MeshBasicMaterial({ color: 0x0000FF });

class DynamicRoom extends DecorObject {

    constructor() {
        super();
        this.envmeshes = [];
        this.positions = [];
        this.refPositions = [];
        this.floorTex = null;
        this.floorMesh = null;
        this.wallTex;
        this.wallmesh;
        this.wallBooleanMesh = null;
        this.heightmin = 120;
        this.heightmax = 700;
        this.widthmax = 1500;
        this.widthmin = 100;
        this.depthmax = 1500;
        this.depthmin = 100;
        this.kickW = 0.02;
        this.wallmat;
        this.wallColor = new THREE.Color(1, 1, 1);
        this.currentWallColor = '0xFFFFFF';
        this.currentWidth = 400; //default values
        this.currentDepth = 400;
        this.currentHeight = 250;
        this.firstrun = true;
        this.windowsAdded = false; // no more room editing after
        this.myUI = null;
        this.uipositioner = null;
        this.snapPoints = [];
        this.refSnapPointPos = [];
        this.boardmesh;
        this.boardBooleanMesh = null;
        this.isRoom = true;
        //this.boxes = new THREE.Object3D();
        //this.add(this.boxes);
        this.classtype = 'DynamicRoom';
        this.pointArray = [];
        this.properties;
        this.floor = null;
        this.ceiling = null;
        this.closed = false;
        this.wallArray = [];
        this.floorMat = null;

        this.viewport = null;
        this.lastPointPos = null;

        this.hitCaster = new THREE.Raycaster();

        this.controlLayer = new THREE.Object3D();
        this.elastLayer = new THREE.Object3D();
        this.add(this.controlLayer);
        this.add(this.elastLayer);
        this.elasticMat = new THREE.LineBasicMaterial({ color: 0xfe7215, linewidth: 1 });
        this.elasticLine = new THREE.Line(new THREE.BufferGeometry(), this.elasticMat);
        this.elastLayer.add(this.elasticLine);
        this.pointPreview = null;

        this.targPos = new THREE.Vector3();
        this.insertIndex = null;
        this.pointY = 0;
        this.elpos = new THREE.Vector3();

        this.floorsnap = null;
        this.wallpaperArray = [];
        this.wallMaterialId = "none";

    };

    setProperty(prop, value) {
        console.log(prop, value);
        switch (prop) {
            case "width":
                this.setWidth(value);
                break;
            case "depth":
                this.setDepth(value);
                break;
            case "height":
                this.setHeight(value);
                break;
            case "color":
                this.changeWallColor(value);
                break;
            case "wallpaper":
                this.changeWallMaterial(value);
                break;
            default:
                break;
        }
        this.registerProperties();

    }

    registerProperties() {
        this.properties = [
            { title: 'color', ui: 'colorpicker', value: this.currentWallColor, icon: 'wallcolor.svg' },
            { title: 'wallpaper', ui: 'imagepicker', value: this.wallpaperArray, icon: 'wall.svg' },
            { title: 'height', ui: 'spinner', range: [this.heightmin, this.heightmax], value: this.currentHeight, icon: 'height.svg' },
            { title: 'roomedit', ui: 'html', value: "roomedit.html" },
            { title: 'remove', ui: 'alert_button' }
        ]
        this.signature.properties = this.properties;
        if (!$('#dimensions').length) {
            let dimdiv = $("<div id='dimensions' class='dimensions'></div>")
            $('body').append(dimdiv);
        }
    }


    setMetaData(dataStr) {
        let values = dataStr.split('|');
        this.currentHeight = Number(values[0]);
        let coords = values[1].split(',');
        // create coordinates
        let i;
        for (i = 0; i < coords.length; i += 3) {
            let cp = new ControlPoint();
            cp.position.x = Number(coords[i]);
            cp.position.y = Number(coords[i + 1]);
            cp.position.z = Number(coords[i + 2]);
            this.controlLayer.add(cp);
            this.pointArray.push(cp);

        }
        this.closed = true;
        
        
        
        this.changeWallColor(values[2].split(',')[0]);

        if(values.length > 2 && values[3] != undefined && values[3] != "none" ){
            this.wallMaterialId =  values[3];
            let timer = setTimeout(() => {
                this.changeWallMaterial(this.wallMaterialId);
            }, 100);
            (values[3]);
        }
    }
    getMetaData() {
        let str = String(this.currentHeight) + "|";
        for (var i = 0; i < this.pointArray.length; i++) {
            str += String(this.pointArray[i].position.x) + "," + String(this.pointArray[i].position.y) + "," + String(this.pointArray[i].position.z) + ',';
        }
        str = str.substring(0, str.length - 1) + "|"; //strip last comma
        for (var j = 0; j < this.wallArray.length; j++) {
            str += String(this.wallArray[j].wallColor) + ",";
        }
       str = str.substring(0, str.length - 1);
       str += "|" + this.wallMaterialId;
    
        return str;
    }




    loadModel(id, model, sku, cb) {
        let host = this;
        this.cb = cb;
        super.loadModel(id, model, sku, function () {
            console.log("my Callback", cb);
            host.registerProperties();
            host.loadedcallback();
            host.getWallpapers();
            cb();
        });
    }
    loadedcallback() {
        
        this.viewport = DD2022.decor3d;
        
        this.drawWalls();
        render();
        this.showhide2D(false);

       /* if(this.defaultMaterialID){
            let scope = this;

            MaterialManager.getMaterial(this.defaultMaterialID, function (mat) {
                scope.changeMaterial('floo', mat, "extension", null);
            });
        }*/
        // if no coordinates are available, automatically enter edit mode.
        let timer = setTimeout(() => {
            this.changeMaterial(this.defaultMaterialKey, this.defaultMaterial, this.defaultMaterialExtension, this.defaultMaterialID);
        }, 1000);
        if (this.pointArray.length < 1) {
            DD2022.enterRoomEditMode(this);
        }
    }

    setHeight(value) {
        //let value = document.getElementById('ltvs__height').value; //convert to meters
        if (value > this.heightmax) value = document.getElementById('ltvs__height').value = this.heightmax;
        //if (value < this.heightmin) value = document.getElementById('ltvs__height').value = this.heightmin;
        if (value < this.heightmin) return;
        let metervalue = value / 100;//convert to meters
        this.currentHeight = value;
        //set height = 2.5m
        this.update();

    }


    changeWallColor(value) {

        //let value = document.getElementById('ltvs__wallcolor').value;
        if (typeof value === 'string') {
            value = value.replace('#', '0x');
        }
        this.currentWallColor = value;
        // this.wallColor.setHex(value);

        for (var i = 0; i < this.wallArray.length; i++) {
            this.wallArray[i].setPaint(value);
        }

        // this.wallmat.setColor(value);
        render();
    }
    getWallpapers(){
        fetch(ltvs__source + '/materials/type/wallpaper')
        .then(response => response.json())
        .then(data => {
            this.wallpaperArray = data;
            this.registerProperties();
        });
    }
    changeWallMaterial(matId){
        if(matId == "none"){
            for (var i = 0; i < this.wallArray.length; i++) {
                this.wallArray[i].resetWallMaterial();
            }
        }
        MaterialManager.getMaterial(matId, this.applyWallMaterial.bind(this))
        this.wallMaterialId = matId;
        
    }
    applyWallMaterial(material){
        if(this.currentWallColor){
            material.color.setHex(this.currentWallColor);
        }


        for (var i = 0; i < this.wallArray.length; i++) {
            this.wallArray[i].setWallPaper(material);
        }
        this.createHoles();
    }
    updateFloorMapping() {

        let u = 0.5;
        let v = 1;
        let scope = this;
        if (this.floor && this.floor.material.map) {
            this.floorTex = this.floor.material.map;
            this.floorTex.repeat.set(u, v);
            render();
        } else {
            //if material not loaded, try again.
            setTimeout(scope.updateFloorMapping.bind(scope), 500);
        }
    }
    changeMaterial(key, material, extension, matid) {
        let scope = this;

        this.defaultMaterialID = matid;
        this.floorMat = material;
        /*this.children.forEach(child => {

            if (child.name.substr(0, 4) == key) {
                child.material = material;
            }
        });*/

        if (this.floor && this.floorMat) {
            this.floor.material = this.floorMat;
            this.floorMat.side = THREE.BackSide;
        }


        scope.updateFloorMapping();
        render();
    }

    changeTexture() {
        createTexture();
    }
    update() {
        this.drawWalls(this.pointArray);
        this.showhide2D(false);
        this.createHoles();
        for (var m = 0; m < this.wallArray.length; m++) {
            this.wallArray[m].update();
        }
        render();
    }

    createTexture() {
        const ctx = document.createElement('canvas').getContext('2d');
        document.body.appendChild(ctx.canvas);
        ctx.canvas.width = 256;
        ctx.canvas.height = 256;
        ctx.fillStyle = '#F00';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let tex = new THREE.CanvasTexture(ctx.canvas);

        this.envmesh.material.map = tex;
        //document.body.appendChild(textureHTML);
    }
    removeUI() {

        if (this.myUI) {
            this.myUI.style.display = "none";
        }
    }

    startWindowDoorAdd() {
        this.windowsAdded = true;
    }
    createHoles() {
        //find any boolean objects
        let bools = [];
        for (var i = 0; i < this.accessoryLayer.children.length; i++) {
            let decObj = this.accessoryLayer.children[i];
            if (decObj.booleanObj) {
                bools.push(decObj.booleanObj);
            }
        }
        // this.wallArray[0].createHoles(bools);
        //boolean each individual wall
        for (var i = 0; i < this.wallArray.length; i++) {
            this.wallArray[i].createHoles(bools);
        }

        render();

    }

    addAccessory(acc) {
        this.removeAccessoryAt(acc);
        this.accessoryLayer.add(acc);
        console.log("ADDING ACC");
    }
    getBoardMesh() {
        return this.boardmesh;
    }
    turnOnSnapPoints(snapID) {
        this.turnOffSnapPoints();
        let snaps = [];
        let scope = this;
        this.snapPoints.forEach(function (sp) {
            if (sp.snap == snapID) {
                sp.visible = true;
                snaps.push(sp);
            }
        });
        // add any snap points from accessories
        /*this.accessories.forEach(function (acc) {
            var accSnaps = acc.turnOnSnapPoints();
            snaps = snaps.concat(accSnaps);
        });*/
        this.accessoryLayer.children.forEach(function (acc) {
            snaps = snaps.concat(acc.turnOnSnapPoints(snapID));
        })
        return snaps;
    }
    turnOffSnapPoints() {
        // this.snapPoints.forEach(function (sp) { sp.visible = false; });
        this.snapPoints.forEach(function (sp) {
            sp.visible = false;
        });
        this.accessoryLayer.children.forEach(function (acc) {
            acc.turnOffSnapPoints();
        })
    }

    drawWalls() {

        this.removeAll();
        if (this.closed) {
            this.pointArray[this.pointArray.length - 1].position.copy(this.pointArray[0].position);
        }
        if (this.pointArray.length > 2 && this.pointArray[0].position.equals(this.pointArray[this.pointArray.length - 1].position)) { // room is closed
            if (!this.checkClockwise(this.pointArray)) {
                this.pointArray.reverse();
            };
            this.closed = true;
        }
        this.snapPoints = [];
        this.wallArray = [];
        for (var i = 0; i < this.pointArray.length - 1; i++) {
            let wall = new Wall(this.pointArray[i].position, this.pointArray[i + 1].position, this.currentHeight);
            this.add(wall);
            let snapSurface = wall.getSnap();
            wall.setPaint(this.currentWallColor);
            this.snapPoints.push(snapSurface);

            snapSurface.snap = 'wall';
            snapSurface.decorObj = this;
            //snapSurface.visible = false;
            snapSurface.material = SnapMaterial;
            this.wallArray.push(wall);

            this.controlLayer.add(this.pointArray[i])
            wall.receiveShadow = true;
        }
        if (this.closed) this.addFloorAndCeiling();
        this.redrawDimensions();

        render();
    }
    checkClockwise(points) {

        var area = 0;
        var j;
        for (var i = 0; i < points.length; i++) {
            j = (i + 1) % points.length;
            area += points[i].position.x * points[j].position.z;
            area -= points[j].position.x * points[i].position.z;
        }
        if (area < 0) {
            return false;
        } else {
            return true;
        }

    }
    removeAll() {
        for (var i = this.children.length - 1; i > -1; i--) {

            let wall = this.children[i];
            if (wall.destroy) {
                this.remove(wall);
                wall.destroy();
            }
        }
        this.wallArray = [];
        for (var i = this.controlLayer.children.length - 1; i > -1; i--) {
            this.controlLayer.remove(this.controlLayer.children[i]);
        }
    }
    showhide2D(value) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].isWall) this.children[i].showhide2D(value);
        }
        this.controlLayer.visible = value;
        render();
        if (value == false) { 
            this.clearDimensions();
        } else {
            this.redrawDimensions();
            this.viewport.showGrid();
        }
    }
    setViewport(view) {
        this.viewport = view;
    }
    removePoint(point) {
        this.pointArray = this.pointArray.filter(element => element != point);
        this.drawWalls(this.pointArray);
    }
    redraw() {
        this.drawWalls(this.pointArray);
    }
    addFloorAndCeiling() {

        if (this.floor) {
            this.floor.geometry.dispose();
            this.ceiling.geometry.dispose();
            this.floorsnap.geometry.dispose();
            this.remove(this.floor);
            this.remove(this.ceiling);
            this.remove(this.floorsnap);
        }

        let shape = new THREE.Shape();
        shape.moveTo(this.pointArray[0].position.x, this.pointArray[0].position.z);
        for (var i = 1; i < this.pointArray.length; i++) {
            shape.lineTo(this.pointArray[i].position.x, this.pointArray[i].position.z);
        }


        var extrudeSettings = {
            steps: 0,
            depth: 0,
            bevelEnabled: false
        };

        //var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        var geometry = new THREE.ShapeGeometry( shape );
        //var material = new THREE.MeshPhongMaterial( { color: 0xd4d19e } );
        if (this.floorMat) {
            this.floor = new THREE.Mesh(geometry, this.floorMat);
            this.floorMat.side = THREE.BackSide;
        } else {
            this.floor = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ side: THREE.BackSide}));
        }
        this.floor.receiveShadow = true;
        this.floor.name = "floor";
        this.floor.col = true; //include in collada render 
        this.add(this.floor);
        this.floor.rotateX(Math.PI / 2);
        this.floor.roomIndex = this.roomIndex;



        this.updateFloorMapping();


        var ceilingMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.FrontSide});


        this.ceiling = new THREE.Mesh(geometry, ceilingMat);
        this.ceiling.castShadow = false;
        this.ceiling.receiveShadow = false;
        this.add(this.ceiling);
        this.ceiling.name = "ceiling";
        this.ceiling.rotateX(Math.PI / 2);
        this.ceiling.position.y = this.currentHeight / 100;

        this.floorsnap = new THREE.Mesh(geometry,SnapMaterialDouble);
        this.floorsnap.name = "_asfloor_0.3dp";
        this.snapPoints.push(this.floorsnap);
        this.floorsnap.snap = "floor";
        this.floorsnap.decorObj = this;
        this.floorsnap.isPlane = true;
        this.floorsnap.rotateX(Math.PI / 2);
        this.add(this.floorsnap);
        this.floorsnap.visible = false;

        this.floorsnap.geometry.computeBoundingBox();
        this.floorsnap.geometry.computeBoundingSphere();

        this.ceiling.geometry.computeBoundingBox();
        this.ceiling.geometry.computeBoundingSphere();

        this.floor.geometry.computeBoundingBox();
        this.floor.geometry.computeBoundingSphere();

        this.floorsnap.geometry.computeBoundingBox();
        this.floorsnap.geometry.computeBoundingSphere();

    }
    addControlPoint(e, snap = 1, designUI) {
        let closing = this.hitTest(e)
        let cp = new ControlPoint();
        /* if(!hide){ //last point is not shown
             
         }*/
        let downX = e.clientX - (this.viewport.renderer.domElement.width / 2);
        let downZ = e.clientY - (this.viewport.renderer.domElement.height / 2);
        cp.position.x = Math.round(((downX * this.viewport.pixelratio) + this.viewport.camera.position.x) * snap) / snap; //snap to nearest 20cm
        cp.position.z = Math.round(((downZ * this.viewport.pixelratio) + this.viewport.camera.position.z) * snap) / snap; // snap to nearest 20cm
        this.snapToExisting(cp);



        // Check if we are close to first point, to make touch screen drawing easier.
        if (this.pointArray.length > 2) {
            let tolerance = 0.3;
            let closeEnough = this.getYplaneDistanceBetween(cp.position, this.pointArray[0].position);
            console.log("close enough?", closeEnough);
            if (closeEnough <= tolerance) {
                closing = true;
                cp.position.x = this.pointArray[0].position.x;
                cp.position.z = this.pointArray[0].position.z;
            }
        }
        this.pointArray.push(cp);
        this.drawWalls();
        if (closing) {
            designUI.removeAllListeners();
            this.removeElastic();
        } else {
            this.controlLayer.add(cp);
            this.lastPointPos = cp;
        }
        render();
    }
    snapToExisting(cp) {
        //Extra snap for 90 degree angles
        let angleSnapTollerance = 0.2;
        for (var i = 0; i < this.pointArray.length; i++) {
            //avoid "snap to self"
            let dist = cp.position.distanceTo(this.pointArray[i].position);
            if (dist> 0.2) {
                if (Math.abs(cp.position.x - this.pointArray[i].position.x) < angleSnapTollerance) {
                    cp.position.x = this.pointArray[i].position.x;
                }
                if (Math.abs(cp.position.z - this.pointArray[i].position.z) < angleSnapTollerance) {
                    cp.position.z = this.pointArray[i].position.z;
                }
            }
        }
    }
    hitTest(e) {
        var rect = this.viewport.container.getBoundingClientRect();
        let mouse = {};
        mouse.x = (e.clientX / rect.width) * 2 - 1;
        mouse.y = - (e.clientY / rect.height) * 2 + 1;
        this.hitCaster.setFromCamera(mouse, this.viewport.camera);
        const intersects = this.hitCaster.intersectObjects(this.controlLayer.children, true);
        if (intersects.length > 0) {
            return intersects[0].object;
        }
        return false;
    }
    drawElastic(e) {
        this.elasticLine.visible = true;
        // console.log("draw elastic", this.elasticLine);
        if (this.lastPointPos == null) return;
        let snap = 10;
        let downX = e.clientX - (this.viewport.renderer.domElement.width / 2);
        let downZ = e.clientY - (this.viewport.renderer.domElement.height / 2);
        let mouse3dx = Math.round(((downX * this.viewport.pixelratio) + this.viewport.camera.position.x) * snap) / snap; //snap to nearest 20cm
        let mouse3dz = Math.round(((downZ * this.viewport.pixelratio) + this.viewport.camera.position.z) * snap) / snap; // snap to nearest 20cm

       // console.log("zoom", (e.clientX - (this.viewport.renderer.domElement.width / 2)) * this.viewport.pixelratio + this.viewport.camera.position.x, mouse3dx, this.viewport.pixelratio);
        const vertices = new Float32Array([
            this.lastPointPos.position.x, 0.3, this.lastPointPos.position.z,
            mouse3dx, 0.3, mouse3dz
        ]);
        let xdist = mouse3dx - this.lastPointPos.position.x;
        let zdist = mouse3dz - this.lastPointPos.position.z;
        let dist = Math.sqrt((xdist * xdist) + (zdist * zdist));

        this.elpos.x = this.lastPointPos.position.x + (xdist / 2);
        this.elpos.z = this.lastPointPos.position.z + (zdist / 2);
        let screen = this.screenXY(this.elpos);
        if (!$('#elasticlength').length) {
            let eldiv = $("<div id='elasticlength' class='elastic-length'></div>")
            $('#dimensions').append(eldiv);
        }
        $('#elasticlength').html(Math.round(dist * 100) + " cm");
        $("#elasticlength").css({ "left": (screen.x - 15) + 'px', "top": screen.y + 'px' });
        


        // itemSize = 3 because there are 3 values (components) per vertex
        this.elasticLine.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.elasticLine.geometry.attributes.position.needsUpdate = true;
        render();
    }
    placePoint(e, point, snap = 1) {
        let downX = e.clientX - (this.renderer.domElement.width / 2);
        let downZ = e.clientY - (this.renderer.domElement.height / 2);
        point.position.x = Math.round(((downX * this.pixelratio) + this.camera.position.x) * snap) / snap; //snap to nearest 20cm
        point.position.z = Math.round(((downZ * this.pixelratio) + this.camera.position.z) * snap) / snap; // snap to nearest 20cm
        point.position.y = this.pointY;
    }
    removeElastic() {
        this.elasticLine.visible = false;
        render();
    }
    removeControlPoint(point) {
        this.controlLayer.remove(point);
        this.render();
    }

    hideControlLayer() {
        this.controlLayer.visible = false;
    }
    updatePointPos(e) {

        let mouse = {};
        mouse.x = e.clientX - (this.viewport.renderer.domElement.width / 2);
        mouse.y = e.clientY - (this.viewport.renderer.domElement.height / 2);
        let mouse3dx = ((mouse.x * this.viewport.pixelratio) + this.viewport.camera.position.x);
        let mouse3dz = ((mouse.y * this.viewport.pixelratio) + this.viewport.camera.position.z);

        //find the closest point on a pre-existing wall and put the new point there.
        var i;
        var shortest = 1000000;
        let p, d, xd, zd;

        for (i = 0; i < this.pointArray.length - 1; i++) {
            p = this.getClosestPoint(this.pointArray[i].position, this.pointArray[i + 1].position, { x: mouse3dx, z: mouse3dz });
            xd = Math.max(p.x, mouse3dx) - Math.min(p.x, mouse3dx);
            zd = Math.max(p.z, mouse3dz) - Math.min(p.z, mouse3dz);
            d = Math.sqrt((xd * xd) + (zd * zd)); //distance from closest point on vector to actual mouse pos

            if (Math.abs(d) < Math.abs(shortest)) {
                shortest = d;
                this.insertIndex = i + 1;
                this.targPos.copy(p);

            }
        }
        if (shortest < 0.5) {
            this.pointPreview.position.copy(this.targPos);
            this.pointPreview.visible = true;
        } else {
            this.pointPreview.visible = false;
            this.pointPreview.position.x = mouse3dx;
            this.pointPreview.position.y = this.pointY;
            this.pointPreview.position.z = mouse3dz;
        }
        render();
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
    getYplaneDistanceBetween(p1, p2) {
        let xComp = p1.x - p2.x;
        let zComp = p1.z - p2.z;
        let dist = Math.sqrt((xComp * xComp) + (zComp * zComp));
        return dist;
    }
    addPointPreview() {
        this.pointPreview = new ControlPoint();
        this.controlLayer.add(this.pointPreview);
    }
    addPoint() {
        this.pointArray.splice(this.insertIndex, 0, this.pointPreview);
        this.drawWalls();
        console.log("points", this.pointArray);
        //continue drawing
        this.addPointPreview();
    }
   
    movePoint(e, point, snap) {
        let mouse = {};
        mouse.x = e.clientX - (this.viewport.renderer.domElement.width / 2);
        mouse.y = e.clientY - (this.viewport.renderer.domElement.height / 2);
        point.position.x = Math.round(((mouse.x * this.viewport.pixelratio) + this.viewport.camera.position.x) * snap) / snap; //snap to nearest 20cm
        point.position.z = Math.round(((mouse.y * this.viewport.pixelratio) + this.viewport.camera.position.z) * snap) / snap; // snap to nearest 20cm
        this.snapToExisting(point);
        this.drawWalls();
    }

    highlightPoint(point) {
        this.lowlightAll();
        point.highlight();
        render();
    }

    lowlightAll() {
        var i;
        for (i = 0; i < this.pointArray.length; i++) {
            this.pointArray[i].lowlight();
        }
        render();
    }

    cancelAll() {
        if (this.pointPreview) {
            this.controlLayer.remove(this.pointPreview);
            this.pointPreview = null;
            this.insertIndex = null;
        }
    }
    redrawDimensions() {
        //remove dimensions from HTML layer
       this.clearDimensions();
        //redraw the dimensions
        // var halfWidth = window.innerWidth / 2;
        // var halfHeight = window.innerHeight / 2;
        let vector;
        let i;
        for (i = 0; i < this.wallArray.length; i++) {
            //work out screen position
            //vector = MathEx.getScreenPosition(dimensionPoints[i], camera, halfWidth, halfHeight);
            vector = this.screenXY(this.wallArray[i].mesh.position);

            $("#dimensions").append("<div style='position:absolute;left:" + Number(vector.x - 15) + "px;top:" + Number(vector.y - 6) + "px'><input type='text' tabindex='" + i + "' onfocus='DD2022.focusRoom.makeNumeric(event)' onfocusout='DD2022.focusRoom.changeLengthOut(event)' onkeydown='DD2022.focusRoom.changeLengthKey(event)' id=wall_" + i + " value='" + Math.round(this.wallArray[i].wallLength * 100) + ' cm' + "' ></div>");
        }
        /* for (i = 0; i < anglePoints.length; i++) {
             //work out screen position
 
             //vector = MathEx.getScreenPosition(anglePoints[i], camera, halfWidth, halfHeight);
             vector = MathEx.screenXY(anglePoints[i].position);
 
 
             $("#dimensions").append("<div style='position:absolute;left:" + Number(vector.x - 5) + "px;top:" + Number(vector.y - 4) + "px'>" + anglePoints[i].value + "</div>");
         }*/
    }

    clearDimensions() {
        $("#dimensions").html("");
    }

    screenXY(objPosition) {

        var vector = new THREE.Vector3();
        vector.copy(objPosition);
        /*var windowWidth = window.innerWidth;
        var minWidth = 1280;
      
        if(windowWidth < minWidth) {
          windowWidth = minWidth;
        }*/

        var widthHalf = this.viewport.renderer.domElement.width / 2;
        var heightHalf = this.viewport.renderer.domElement.height / 2;

        vector.project(this.viewport.camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = - (vector.y * heightHalf) + heightHalf;
        vector.z = 0;

        return vector;

    }

    makeNumeric(e) {
        e.target.value = e.target.value.substr(0, e.target.value.length - 3);
    }
    changeLengthOut(e) {

        this.changeLength(e.target);

    }
    changeLengthKey(e) {
        if (e.keyCode == 9 || e.keyCode == 13) {
            this.changeLength(e.target);
        }
    }
    changeLength(box) {

        if (isNaN(box.value)) {
            return;
        }
        let index = parseInt(box.id.split('_')[1]);
        console.log("index", index);

        let wall = this.wallArray[index];
        let newLength = box.value / 100;

     
        var wallAngle = Math.atan2(this.pointArray[index + 1].position.z - this.pointArray[index].position.z, this.pointArray[index + 1].position.x - this.pointArray[index].position.x);
       
        let xoffest = newLength * Math.cos(wallAngle);
        let zoffset = newLength * Math.sin(wallAngle);

        //this.pointArray[index + 1].position.x = this.pointArray[index].position.x + xoffest;
        //this.pointArray[index + 1].position.z = this.pointArray[index].position.z + zoffset;

        if (wall.wallRotation >= 0 && wall.wallRotation < 135 * (Math.PI / 180)) {
            this.pointArray[index + 1].position.x = this.pointArray[index].position.x + xoffest;
            this.pointArray[index + 1].position.z = this.pointArray[index].position.z + zoffset;
        } else {
            this.pointArray[index].position.x = this.pointArray[index + 1].position.x - xoffest;
            this.pointArray[index].position.z = this.pointArray[index + 1].position.z - zoffset;

        }

        // if the last point is moving, remember to move the first point also
        if (index + 1 == this.pointArray.length - 1) {
            this.pointArray[0].position.x = this.pointArray[index + 1].position.x;
            this.pointArray[0].position.z = this.pointArray[index + 1].position.z;
        }
        if (index == 0) {
            this.pointArray[this.pointArray.length - 1].position.x = this.pointArray[0].position.x;
            this.pointArray[this.pointArray.length - 1].position.z = this.pointArray[0].position.z;
        }
        this.drawWalls();

    }

}

export default DynamicRoom




