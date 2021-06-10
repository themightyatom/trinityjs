
import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';
import CSG from "/js/three-csg.js"

const bluemat = new THREE.MeshBasicMaterial({color:0x0000FF,visible:false});

class SquareRoom extends DecorObject {
    
    constructor() { 
        super();
        this.envmesh;
        this.positions;

    };
    

     loadModel (id, model, sku, cb) {
        let host = this;
        this.cb = cb;
        super.loadModel (id, model, sku, function(){
            cb();
            host.loadedcallback();
        });
        
        console.log("OVERIDDEN", this.cb);
     }
     loadedcallback(){
       console.log("ready");
       this.getVerts();
       this.createUI();
     }
     getVerts() {
        console.log("getting verts", this.scene);
        this.envmesh = this.scene.children[0];
        this.positions = this.envmesh.geometry.getAttribute('position').array;
        console.log(this.positions);
       
    }
    increaseHeight() {


        //set height = 2.5m
        for (var i = 1; i < this.positions.length; i += 3) {
            
            if (this.positions[i] > 1) this.positions[i] += 0.1;
        }
        this.update();

    }
    increaseWidth() {
        //set height = 2.5m
        for (var i = 0; i < this.positions.length; i += 3) {
            
            if (this.positions[i] > 0.1) this.positions[i] += 0.05;
            if (this.positions[i] < -0.1) this.positions[i] -= 0.05;
        }
        this.update();
    }
    increaseDepth() {
        for (var i = 2; i < this.positions.length; i += 3) {
            
            if (this.positions[i] > 0.1) this.positions[i] += 0.05;
            if (this.positions[i] < -0.1) this.positions[i] -= 0.05;
        }
        this.update();
    }

    addHole() {
        // Make 2 box meshes.. 
        console.log("adding hole");
       
        let meshB = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 1), new THREE.MeshBasicMaterial);
//        scene.add(meshB);

        //offset one of the boxes by half its width..

        meshB.position.add(new THREE.Vector3(1, 1, 0));

        //Make sure the .matrix of each mesh is current
        meshB.updateMatrix();
        this.envmesh.updateMatrix();

        //Create a bsp tree from each of the meshes

        let bspA = CSG.fromMesh(this.envmesh,0)
        let bspB = CSG.fromMesh(meshB,1)

        // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

        let bspResult = bspA.subtract(bspB)

        //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

        let meshResult = CSG.toMesh(bspResult, this.envmesh.matrix);
        meshResult.material =[this.envmesh.material,bluemat];
        envLayer.remove(this.envmesh);
        this.envmesh.visible = false;
        envLayer.add(meshResult);
        this.envmesh = meshResult;
        this.positions = this.envmesh.geometry.getAttribute('position').array;
    }
    changeTexture(){
        createTexture();
    }
    update() {
        this.envmesh.geometry.attributes.position.needsUpdate = true;
    }
    createTexture(){
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
    createUI(){
        console.log("creating UI");
    }
    

}

export default SquareRoom


