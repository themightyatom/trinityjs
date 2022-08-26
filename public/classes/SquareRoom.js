
import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';
import CSG from "/js/three-csg.js"


const bluemat = new THREE.MeshBasicMaterial({ color: 0x0000FF });

class SquareRoom extends DecorObject {

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
        this.wallmat;
        this.wallColor = new THREE.Color(1,1,1);
        this.currentWallColor = '#FFFFFF';
        this.currentWidth = 400; //default values
        this.currentDepth = 400;
        this.currentHeight = 250;
        this.kickW = 0.02;
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
        this.classtype = 'SquareRoom';
        this.properties;
        this.pointArray = [new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()]; //fake outline
        
       
    };

    setProperty(prop,value){
        console.log(prop,value);
        switch(prop){
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
            default:
                break;
        }
        this.registerProperties();
        
    }

    registerProperties(){
        this.properties =[
            {title:'width', ui:'spinner', range:[this.widthmin, this.widthmax], value:this.currentWidth, icon:'width.svg'},
            {title:'depth', ui:'spinner', range:[this.depthmin, this.depthmax], value:this.currentDepth,icon:'depth.svg'},
            {title:'height', ui:'spinner', range:[this.heightmin, this.heightmax], value:this.currentHeight, icon:'height.svg'},
            {title:'color', ui:'colorpicker', value:this.currentWallColor, icon:'wallcolor.svg'},
            {title:'remove', ui:'alert_button'}
        ]
        this.signature.properties = this.properties;
    }

   
    setMetaData(dataStr){
        let values = dataStr.split(',');
        this.currentWidth = values[0];
        this.currentDepth = values[1];
        this.currentHeight = values[2];
        this.wallColor.setHex('0x' + values[3]);
    }




    loadModel(id, model, sku, cb) {
        let host = this;
        this.cb = cb;
        super.loadModel(id, model, sku, function () { 
            console.log("my Callback", cb);
            host.registerProperties();
            host.loadedcallback();
            cb();
        });


    }
    loadedcallback() {
       
        this.getVerts();
        let timer = setTimeout(() => {
            this.changeMaterial(this.defaultMaterialKey,this.defaultMaterial,this.defaultMaterialExtension,this.defaultMaterialID);
        },10);
        
    }
    getVerts() {

        this.position.set(0, 0, 0);
 

        let room = this;
        this.scene.traverse(function (child) {

            if (child.isMesh) {
             
                switch (child.name) {
                    case "walls":
                        room.wallmat = child.material;
                        room.wallmat.color = room.wallColor;
                        room.wallTex = child.material.normalMap;
                        room.wallTex.repeat.set(3, 3);
                        room.wallmesh = child;
                       
                        break;
                    case "floor":
                        //scale UVs
                        room.floorTex = child.material.map;
                        child.material.side = THREE.FrontSide;
                       // room.floorTex.repeat.set(2, 4);
                        room.floorMesh = child;                     
                        break;
                    case "boards":
                        room.boardmesh = child;
                        break;
                    default:
                        break;

                }
                if(child.name.substr(0,3) == '_as'){
                   // room.snapPoints.push(child);
                   room.refSnapPointPos.push(child.position);
                   // check for plane. isPlane my not be set at this time.
                  // if(child.geometry.getAttribute('position').array.length == 12){
                   // 4 vertices gives 12 buffergeometry values.
                    room.envmeshes.push(child);
                    let pos = child.geometry.getAttribute('position').array;
                    room.positions.push(pos);
                    room.refPositions.push(pos.slice());
                  // }

                }else{
                    room.envmeshes.push(child);
                    let pos = child.geometry.getAttribute('position').array;
                    room.positions.push(pos);
                    room.refPositions.push(pos.slice());
                }
                child.castShadow = false;
            }

        })

        this.setUpDefaults();

    }

    setUpDefaults(){
        
            //set defaults
            this.setHeight(this.currentHeight);
            this.setWidth(this.currentWidth);
            this.setDepth(this.currentDepth);
            this.firstrun = false;
        
    }

    setHeight(value) {
        //let value = document.getElementById('ltvs__height').value; //convert to meters
        if (value > this.heightmax) value = document.getElementById('ltvs__height').value = this.heightmax;
       // if (value < this.heightmin) value = document.getElementById('ltvs__height').value = this.heightmin;
        if (value < this.heightmin) return; //ignore value, something is being typed.
        let metervalue = value / 100;//convert to meters
        this.currentHeight = value;
        //set height = 2.5m
        for (var m = 0; m < this.envmeshes.length; m++) {
            for (var i = 1; i < this.positions[m].length; i += 3) {

                //if (this.refPositions[m][i] > 0.5) this.positions[m][i] = metervalue;
                if (this.refPositions[m][i] > 0.5) this.positions[m][i] = metervalue + (this.refPositions[m][i] - 2);
            }
        }
        this.update();

    }

    setWidth(value) {
        
       // let value = document.getElementById('ltvs__width').value; //convert to meters
        
        if (value > this.widthmax) value = document.getElementById('ltvs__width').value = this.widthmax;
        //if (value < this.widthmin) value = document.getElementById('ltvs__width').value = this.widthmin;
        if (value < this.widthmin) return; //ignore value, something is being typed.
        let metervalue = value / 100;//convert to meters
        this.currentWidth = value;
        for (var m = 0; m < this.envmeshes.length; m++) {
            for (var i = 0; i < this.positions[m].length; i += 3) {
                if (this.refPositions[m][i] > 0.1) this.positions[m][i] = metervalue / 2 + (this.refPositions[m][i] - 1); //keep offsets, scurting boards, etc.
                if (this.refPositions[m][i] < -0.1) this.positions[m][i] = -(metervalue / 2) + (this.refPositions[m][i] + 1);
            }
        }
        //move snap Points
       /* for(var sp=0; sp < this.snapPoints.length; sp++){
            // don't move planes. This would give a double translation
            if(!this.snapPoints[sp].isPlane){
                if(this.refSnapPointPos[sp].x > 0.1) this.snapPoints[sp].position.x = metervalue/2 + (this.refSnapPointPos[sp].x - 1); 
                if(this.refSnapPointPos[sp].x < -0.1) this.snapPoints[sp].position.x = -metervalue/2 + (this.refSnapPointPos[sp].x + 1); 
            }
        } */
        this.updateFloorMapping();
        this.update();


    }

    setDepth(value) {

       // let value = document.getElementById('ltvs__depth').value;
        if (value > this.depthmax) value = document.getElementById('ltvs__depth').value = this.depthmax;
       // if (value < this.depthmin) value = document.getElementById('ltvs__depth').value = this.depthmin;
        if (value < this.depthmin) return;
      
        let metervalue = value / 100;//convert to meters
        this.currentDepth = value;
     
        for (var m = 0; m < this.envmeshes.length; m++) {
            for (var i = 2; i < this.positions[m].length; i += 3) {

                if (this.refPositions[m][i] > 0.1) this.positions[m][i] = metervalue / 2 + (this.refPositions[m][i] - 1);
                if (this.refPositions[m][i] < -0.1) this.positions[m][i] = -(metervalue / 2) + (this.refPositions[m][i] + 1);
            }
        }
         //move snap Points
       /*  for(var sp=0; sp < this.snapPoints.length; sp++){
             // don't move planes. This would give a double translation
            if(!this.snapPoints[sp].isPlane){
                if(this.refSnapPointPos[sp].z > 0.1) this.snapPoints[sp].position.z = metervalue/2 + (this.refSnapPointPos[sp].z - 1); 
                if(this.refSnapPointPos[sp].z < -0.1) this.snapPoints[sp].position.z = -metervalue/2 + (this.refSnapPointPos[sp].z + 1); 
            }
        } */
        this.updateFloorMapping();
        this.update();

    }

    changeWallColor(value) {
        this.currentWallColor = value;
        //let value = document.getElementById('ltvs__wallcolor').value;
        if (typeof value === 'string') {
            value = value.replace('#', '0x');
        }
  
        this.wallColor.setHex(value);
        
        
        this.update();
        // this.wallmat.setColor(value);
        render();
    }
    updateFloorMapping() {

        let u = this.currentWidth / 200;
        let v = this.currentDepth / 100;
        let scope = this;
        if(this.floorMesh.material.map){
            this.floorTex = this.floorMesh.material.map;
            this.floorTex.repeat.set(u, v);
            render();
        } else{
            //if material not loaded, try again.
            setTimeout(scope.updateFloorMapping.bind(scope),500);
        }
    }
    changeMaterial(key, material, extension, matid) {
        let scope = this;
        let containsKey = false;
        this.defaultMaterialID = matid;
        if (this.scene != null) {
            this.scene.traverse(function (child) {
                if (child.name.substr(0, 4) == key) {
                    child.material = material;
                    containsKey = true;
                }
            });
            scope.updateFloorMapping();
            render();
        }
    
    }
    addHole(target,boolobj) {
      
        //Make sure the .matrix of each mesh is current
        target.updateMatrix();
        boolobj.updateMatrix();
        let bool = new THREE.Mesh(boolobj.geometry, bluemat);
        //bool.matrix.copy(boolobj.matrixWorld);
        boolobj.getWorldPosition(bool.position);
        boolobj.getWorldQuaternion( bool.quaternion)
       // bool.position.copy(this.gph);
       // bool.quaternion.copy(boolobj.quaternion);
        bool.updateMatrix();

        //this.scene.add(bool);
 

        
        //Create a bsp tree from each of the meshes

        let bspA = CSG.fromMesh(target, 0);
        let bspB = CSG.fromMesh(bool, 1);

        // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

        let bspResult = bspA.subtract(bspB)

        //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

        let meshResult = CSG.toMesh(bspResult, target.matrix);
        meshResult.material = target.material;
        if(target == this.wallBooleanMesh) this.wallBooleanMesh = meshResult; 
        if(target == this.boardBooleanMesh) this.boardBooleanMesh = meshResult;
        

    }
    changeTexture() {
        createTexture();
    }
    update() {
        /*while(this.boxes.children.length > 0){
            this.boxes.remove(this.boxes.children[0]);
        }*/
        for (var m = 0; m < this.envmeshes.length; m++) {
            this.envmeshes[m].geometry.attributes.position.needsUpdate = true;

            //Essential for subsequent raycasting. Otherwise uses original size
            this.envmeshes[m].geometry.computeBoundingBox();
            this.envmeshes[m].geometry.computeBoundingSphere();
            //this.envmeshes[m].updateMatrixWorld(true,true);
           /* if(this.envmeshes[m].name.substr(0,3) == "_as"){
            let box = new THREE.Box3();
            box.copy( this.envmeshes[m].geometry.boundingBox ).applyMatrix4( this.envmeshes[m].matrixWorld );
            let helper = new THREE.Box3Helper( box, 0xffff00 );
            this.boxes.add( helper );
            }*/
        }
         // create fake point array for wall snapping
         this.pointArray[0].position.x = -this.currentWidth/200;
         this.pointArray[0].position.z = -this.currentDepth/200;
 
         this.pointArray[1].position.x = this.currentWidth/200;
         this.pointArray[1].position.z = -this.currentDepth/200;
 
         this.pointArray[2].position.x = this.currentWidth/200;
         this.pointArray[2].position.z = this.currentDepth/200;
 
         this.pointArray[3].position.x = -this.currentWidth/200;
         this.pointArray[3].position.z = this.currentDepth/200;
 
         this.pointArray[4].position.x = -this.currentWidth/200;
         this.pointArray[4].position.z = -this.currentDepth/200;
        render();
        
    }
    getMetaData(){
        return String(this.currentWidth + ',' + this.currentDepth + ',' + this.currentHeight + ','+this.wallColor.getHexString());
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
    createHoles(){

        if(this.wallBooleanMesh){
            this.wallBooleanMesh.geometry.dispose();
            this.scene.remove(this.wallBooleanMesh);
        }
        this.wallBooleanMesh = new THREE.Mesh(this.wallmesh.geometry, this.wallmesh.material);
        this.wallBooleanMesh.matrix.copy(this.wallmesh.matrix);
      
        let includedDoors = [];
        for(var i=0;i<this.accessoryLayer.children.length;i++){
            let decObj = this.accessoryLayer.children[i];
            if(decObj.booleanObj){
                
                this.addHole(this.wallBooleanMesh,decObj.booleanObj);
                if(decObj.name.substr(0,4) == "door") includedDoors.push(decObj);
            }
        }
        this.wallmesh.visible = false;
        this.scene.add(this.wallBooleanMesh);
       // this.wallBooleanMesh.material.wireframe = true;
       

        // for doors, create gaps in boards
        
            if(this.boardBooleanMesh){
                this.boardBooleanMesh.geometry.dispose();
                this.scene.remove(this.boardBooleanMesh);
            }
            this.boardBooleanMesh = new THREE.Mesh(this.boardmesh.geometry,this.boardmesh.material);
            this.boardBooleanMesh.matrix.copy(this.boardmesh.matrix);
            for(var i=0;i<includedDoors.length;i++){
                if(includedDoors[i].booleanObj){
                    this.addHole(this.boardBooleanMesh,includedDoors[i].booleanObj);
                }
            }
            this.boardmesh.visible = false;
            this.scene.add(this.boardBooleanMesh);


        this.wallBooleanMesh.castShadow = false;
        render();

    }

    addAccessory(acc) {
        this.removeAccessoryAt(acc);
        this.accessoryLayer.add(acc);
        console.log("ADDING ACC");
    }
    getBoardMesh(){
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

}

export default SquareRoom




