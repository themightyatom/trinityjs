import * as THREE from '/three/build/three.module.js';
import CSG from "/js/three-csg.js";
import { Object3D } from '/three/build/three.module.js';
import WallMaterial from "/js/WallMaterial.js";

const bluemat = new THREE.MeshBasicMaterial({ color: 0x0000FF });

class Wall extends Object3D {
    constructor(start, end, height, kickwidth = 0.04) {
        super();
        this.start = start;
        this.end = end;
        this.mesh;
        this.wallMaterial = WallMaterial;
        this.kickMat = new THREE.MeshStandardMaterial();
        this.mat2D = new THREE.MeshBasicMaterial();
        this.mat2D.color.setHex(0x777777);
        this.base;
        this.mesh2D;
        this.wallLength;
        this.wallH = height / 100;
        this.kickH = 0.1;
        this.kickW = kickwidth;
        this.wallT = .1;
        this.snapSurface;
        this.isWall = true;
        this.booleanMesh = null;
        this.boardBooleanMesh = null;
        this.snap;
        this.wallRotation;
        this.classtype = "wall";
        
        this.wallColor = "#FFFFFF";
        this.kickboard = false;
        this.tileFactor = 2;
        this.draw();
        
    }
    draw() {
        let wallobj = this.distanceBetweenPoints(this.start, this.end)
        this.wallLength = wallobj.distance;
        if (this.mesh) {
            this.remove(this.mesh);
            this.mesh.destroy();
            this.remove(this.mesh2D);
            this.mesh2D.destroy();
            if(this.kickboard){
            this.remove(this.base);
            this.base.destroy();
            }
        }
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(this.wallLength, this.wallH), this.wallMaterial);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = false;
        this.mesh.position.y = this.wallH / 2;

        this.mesh2D = new THREE.Object3D();
        let blackLine = new THREE.Mesh(new THREE.PlaneGeometry(this.wallLength, this.wallT), this.mat2D);
        this.mesh2D.add(blackLine);
        blackLine.rotateX(-Math.PI / 2);
        this.mesh2D.position.y = -0.01; //show under floor
        //snap surface
        this.snapSurface = new THREE.Mesh(new THREE.PlaneGeometry(this.wallLength, this.wallH), this.wallMaterial);
        this.snapSurface.position.y = this.wallH / 2;
        this.snapSurface.isPlane = true;
        this.snapSurface.name = "_aswall_0";
        this.snapSurface.visible = false;

        this.snapSurface.geometry.computeBoundingBox();
        this.snapSurface.geometry.computeBoundingSphere();

      
         
        let xpos = Math.min(this.start.x, this.end.x) + wallobj.xcomp / 2;
        let zpos = Math.min(this.start.z, this.end.z) + wallobj.zcomp / 2;
        this.mesh.position.x = this.mesh2D.position.x = this.snapSurface.position.x = xpos;
        this.mesh.position.z = this.mesh2D.position.z = this.snapSurface.position.z = zpos;

       
        //this.base.position.z = this.kickW/2;
        this.wallRotation = this.radianFrom2Points(this.start, this.end);
        this.mesh.rotateY(this.wallRotation);
        this.mesh2D.rotateY(this.wallRotation);
        this.snapSurface.rotateY(this.wallRotation);
        if(this.kickboard){
            this.base = new THREE.Mesh(new THREE.BoxGeometry(this.wallLength + (this.kickW), this.kickH, this.kickW), this.kickMat);
            this.base.position.y = this.kickH / 2;
            this.base.rotateY(this.wallRotation);
            this.add(this.base);
            this.base.position.x = xpos;
            this.base.position.z = zpos;
        }
        this.add(this.mesh);
        this.add(this.mesh2D);
        this.add(this.snapSurface);

        this.mesh.receiveShadow = true;
        this.mesh.castShadow = false;

        
        this.scaleUVs(this.mesh);
        

    

    }

    scaleUVs(mesh){
        var uvs = mesh.geometry.attributes.uv.array;
        var len=uvs.length;
        for ( var i = 0; i<len; i+= 2 ) {

            uvs[i] *= (this.wallLength * this.tileFactor);
            uvs[i+1] *= (this.wallH * this.tileFactor);

        }
    }
    createHoles(booleanObjects) {
        console.log("creating holes");
        if (this.booleanMesh) {
            this.booleanMesh.geometry.dispose();
            this.remove(this.booleanMesh);
        }
        this.booleanMesh = new THREE.Mesh(this.mesh.geometry, this.wallMaterial);
        // this.booleanMesh.matrix.copy(this.mesh.matrix);
        this.booleanMesh.position.copy(this.mesh.position);
        this.booleanMesh.quaternion.copy(this.mesh.quaternion);
        render();
        let includedDoors = [];
        for (var i = 0; i < booleanObjects.length; i++) {
            this.addHole(this.booleanMesh, booleanObjects[i]);
            if (booleanObjects[i].parent.parent.name.substr(0, 4) == "door") includedDoors.push(booleanObjects[i]);
        }
        this.mesh.visible = false;
        this.booleanMesh.material = this.wallMaterial;

        
        this.booleanMesh.castShadow = false;
        this.booleanMesh.receiveShadow = true;
       
        this.add(this.booleanMesh);
        // this.wallBooleanMesh.material.wireframe = true;

        if (includedDoors.length > 0 && this.kickboard) {

            // for doors, create gaps in boards

            if (this.boardBooleanMesh) {
                this.boardBooleanMesh.geometry.dispose();
                this.remove(this.boardBooleanMesh);
            }
            this.boardBooleanMesh = new THREE.Mesh(this.base.geometry, this.kickMat);
            this.boardBooleanMesh.position.copy(this.base.position);
            this.boardBooleanMesh.quaternion.copy(this.base.quaternion);
            for (var p = 0; p < includedDoors.length; p++) {

                this.addHole(this.boardBooleanMesh, includedDoors[p]);

            }
            this.base.visible = false;
            this.add(this.boardBooleanMesh);

            this.boardBooleanMesh.castShadow = false;
            this.boardBooleanMesh.receiveShadow = true;

            this.boardBooleanMesh.material = this.kickMat;
            console.log("MAT", this.boardBooleanMesh.material);
        }
    }
    addHole(target, boolobj) {

        //Make sure the .matrix of each mesh is current
        target.updateMatrix();
        boolobj.updateMatrix();
        let bool = new THREE.Mesh(boolobj.geometry, bluemat);

        boolobj.getWorldPosition(bool.position);
        boolobj.getWorldQuaternion(bool.quaternion);
        bool.geometry.computeBoundingBox();
        bool.updateMatrix();



        //does bool go through wall?
        let box = new THREE.Box3();
        //let helper = new THREE.Box3Helper( box, 0xffff00 );
        //this.add( helper );
        box.setFromObject(target);
        let box2 = new THREE.Box3();
        box2.setFromObject(bool);
        //let helper2 = new THREE.Box3Helper( box2, 0xff0000);
        //this.add( helper2 );
        if (!box.intersectsBox(box2)) return;;
        //this.add(bool);
        //return;



        //Create a bsp tree from each of the meshes

        let bspA = CSG.fromMesh(target, 0);
        let bspB = CSG.fromMesh(bool, 1);

        // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

        let bspResult = bspA.subtract(bspB)

        //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

        let meshResult = CSG.toMesh(bspResult, target.matrix);

        if (target == this.booleanMesh) this.booleanMesh = meshResult;
         if (target == this.boardBooleanMesh) this.boardBooleanMesh = meshResult;

         this.booleanMesh.castShadow = false;



    }
    setPaint(value) {
        this.wallMaterial.color.setHex(value);
        this.wallColor = value;
    }
    setWallPaper(material){
        this.wallMaterial = material;
        this.wallMaterial.needsUpdate = true;
        render();
        
    }
    resetWallMaterial(){
        this.wallMaterial = new THREE.MeshStandardMaterial({color:this.wallColor});
    }
    getSnap() {
        return this.snapSurface;
    }
    distanceBetweenPoints(point1, point2) {
        let xdist = Math.max(point1.x, point2.x) - Math.min(point1.x, point2.x);
        let zdist = Math.max(point1.z, point2.z) - Math.min(point1.z, point2.z);
        let dist = Math.sqrt((xdist * xdist) + (zdist * zdist));

        return { distance: dist, xcomp: xdist, zcomp: zdist };
    }
    showhide2D(value) {
        this.mesh2D.visible = value;
    }
    destroy() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.mesh2D.children[0].geometry.dispose();
        this.mesh2D.children[0].material.dispose();
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

    update() {
        if (this.booleanMesh) {
            this.booleanMesh.geometry.attributes.position.needsUpdate = true;
            //Essential for subsequent raycasting. 
            this.booleanMesh.geometry.computeBoundingBox();
            this.booleanMesh.geometry.computeBoundingSphere();
        }


    }
}

export default Wall 