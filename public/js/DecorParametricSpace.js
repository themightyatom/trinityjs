import DecorObject from '/js/DecorObject.js';
import * as THREE from '/three/build/three.module.js';
import CSG from "/js/three-csg.js"

var DecorParametricSpace = (function () {
    var paramodel;
    var positions;
    var envmesh;
    let redmat = new THREE.MeshBasicMaterial({color:0xFF0000});
    let bluemat = new THREE.MeshBasicMaterial({color:0x0000FF,visible:false});
    let wallcolor = '#FF0000';
    function getVerts() {
        console.log("getting verts");
        envmesh = paramodel.scene.children[0];
        positions = envmesh.geometry.getAttribute('position').array;
        console.log(positions);
       
    }
    function update() {
        envmesh.geometry.attributes.position.needsUpdate = true;
    }
    function createTexture(){
        const ctx = document.createElement('canvas').getContext('2d');
        document.body.appendChild(ctx.canvas);
        ctx.canvas.width = 256;
        ctx.canvas.height = 256;
        ctx.fillStyle = '#F00';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let tex = new THREE.CanvasTexture(ctx.canvas);
       
        //console.log("texture", tex);
        let mat = new THREE.MeshStandardMaterial({map:tex});
        envmesh.material.map = tex;
        //document.body.appendChild(textureHTML);
    }

    return {
        loadEnvironment(model) {
            console.log("env", model);
            let env = new DecorObject();
            env.name = model;
            envLayer.add(env);
            paramodel = env;
            env.loadModel('env', model, '', function () {
                getVerts();
            });

            dev__hidespinner();

        },
        increaseHeight() {


            //set height = 2.5m
            for (var i = 1; i < positions.length; i += 3) {
                console.log(positions[i]);
                if (positions[i] > 1) positions[i] += 0.1;
            }
            update();

        },
        increaseWidth() {

            //set height = 2.5m
            for (var i = 0; i < positions.length; i += 3) {
                console.log(positions[i]);
                if (positions[i] > 0.1) positions[i] += 0.05;
                if (positions[i] < -0.1) positions[i] -= 0.05;
            }
            update();

        },
        increaseDepth() {
            for (var i = 2; i < positions.length; i += 3) {
                console.log(positions[i]);
                if (positions[i] > 0.1) positions[i] += 0.05;
                if (positions[i] < -0.1) positions[i] -= 0.05;
            }
            update();
        },

        addHole() {
            // Make 2 box meshes.. 
            console.log("adding hole");
           
            let meshB = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 1), new THREE.MeshBasicMaterial);
    //        scene.add(meshB);

            //offset one of the boxes by half its width..

            meshB.position.add(new THREE.Vector3(1, 1, 0));

            //Make sure the .matrix of each mesh is current
            meshB.updateMatrix();
            envmesh.updateMatrix();

            //Create a bsp tree from each of the meshes

            let bspA = CSG.fromMesh(envmesh,0)
            let bspB = CSG.fromMesh(meshB,1)

            // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect

            let bspResult = bspA.subtract(bspB)

            //Get the resulting mesh from the result bsp, and assign meshA.material to the resulting mesh

            let meshResult = CSG.toMesh(bspResult, envmesh.matrix);
            meshResult.material =[envmesh.material,bluemat];
            envLayer.remove(envmesh);
            envmesh.visible = false;
            envLayer.add(meshResult);
            envmesh = meshResult;
            positions = envmesh.geometry.getAttribute('position').array;
        },
        changeTexture(){
            createTexture();
        }
    }

})();

export default DecorParametricSpace;

document.addEventListener('keydown', logKey);
function logKey(e) {
    console.log(` ${e.code}`);
    if (e.code == "KeyW") increaseHeight();
    if (e.code == "KeyA") increaseWidth();
    if (e.code == "KeyD") increaseDepth();
    if (e.code == "KeyB") addHole();
    if (e.code == "KeyT") changeTexture();
}