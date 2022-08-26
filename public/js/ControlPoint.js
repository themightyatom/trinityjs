import * as THREE from '/three/build/three.module.js';
import { Object3D } from '/three/build/three.module.js';
class ControlPoint extends Object3D
{
    constructor(){
        super();
        this.mesh;
        this.create();
        this.isControlPoint = true;
    }
    create(){
       // const geometry = new THREE.CircleGeometry( 5, 32 );
        const geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0x777777 } );
        material.side = THREE.BackSide;
        material.depthTest = false;
        this.mesh = new THREE.Mesh( geometry, material );
        const geom2 = new THREE.SphereGeometry(0.08, 16, 16);
        const mat2 = new THREE.MeshBasicMaterial({color:0xFFFFFF});
        this.mesh2 = new THREE.Mesh(geom2,mat2);
        this.add(this.mesh);
        this.add(this.mesh2);
    }
    highlight(){
        this.mesh2.material.color.set(0xfe7215);
    }
    lowlight(){
        this.mesh2.material.color.set(0xFFFFFF);
    }

}

export default ControlPoint