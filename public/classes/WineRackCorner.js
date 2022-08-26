import WineRack from "/classes/WineRack.js";
import * as THREE from '/three/build/three.module.js';
import { Object3D } from '/three/build/three.module.js';

class WineRackCorner extends WineRack  {
    constructor() {
        super();
        this.classtype = 'WineRackCorner';
        this.capacity = {mag:0,champ:0,bot:0,half:0};
    } 
    
    
    
    createWallSnaps(kickwidth = 0){
        //create three snap points along the back side of the object
        let debug = false;
        let container = this;

        this.removeWallSnaps(); // so as not to include in measurement
        
        //temporarily detach snap points
        for(var i = 0; i < this.snapPoints.length;i++){
           // console.log("snap parent", this.snapPoints[i].parent);
            this.scene.remove(this.snapPoints[i]);
        }
        //temporarily remove rotation
        this.updateMatrixWorld();
        let tempQ = new THREE.Quaternion().copy(this.quaternion);    
        this.quaternion.copy(new THREE.Quaternion());
        this.updateMatrixWorld();


        let bbox = new THREE.Box3();

        if(this.fakeBoundingBox){
            bbox.setFromObject(this.fakeBoundingBox,true);
            bbox.getCenter(container.center);
            bbox.getSize(container.size);
        }else{
            bbox.setFromObject(container,true);
            bbox.getCenter(container.center);
            bbox.getSize(container.size); 
        }
       

        this.quaternion.copy(tempQ);

        const geometry = new THREE.BoxGeometry( 0.04, 0.04, 0.04 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

        if(this.backSnap == null){
            debug ? this.backSnap = new THREE.Mesh( geometry, material ): this.backSnap = new Object3D(); 
            debug ? this.rightSnap = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xFF0000} ) ) : this.rightSnap = new Object3D();
            debug ? this.rightSnapFront = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x00FFFF} ) ) : this.rightSnapFront = new Object3D();
            debug ? this.rightSnapTop = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xFF0000} ) ) : this.rightSnapTop = new Object3D();
            debug ? this.rightSnapFrontTop = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x00FFFF} ) ) : this.rightSnapFrontTop = new Object3D();
            debug ? this.leftSnap = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x0000FF} )  ) : this.leftSnap = new Object3D();
            debug ? this.leftSnapTop = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x0000FF} )  ) : this.leftSnapTop = new Object3D();
            debug ? this.frontSnap = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xFF00FF} )  ): this.frontSnap = new Object3D();
        };
        

        //position snaps on back edge of object, regardless of center offset
        let zpos =  this.backSnap.position.z = this.center.z - (this.size.z/2) - container.position.z - kickwidth;
        let centerx = this.center.x - container.position.x;
        let centery = container.position.y;
        this.add( this.backSnap );
        this.backSnap.position.z = zpos;
        this.backSnap.position.x = centerx;
        
       
        this.add(this.rightSnap);
        this.rightSnap.position.z = zpos
        this.rightSnap.position.x = centerx + (this.size.x/2) + kickwidth;
        this.rightSnap.name = "RB";

        this.add(this.rightSnapTop);
        this.rightSnapTop.position.z = zpos
        this.rightSnapTop.position.x = centerx + (this.size.x/2) + kickwidth;
        this.rightSnapTop.position.y = this.size.y;
        this.rightSnapTop.name = "RT";

        
        this.add(this.leftSnap);
        this.leftSnap.position.z = zpos;
        this.leftSnap.position.x = centerx - (this.size.x/2) - kickwidth;
        this.leftSnap.name = "LB"

        this.add(this.leftSnapTop);
        this.leftSnapTop.position.z = zpos;
        this.leftSnapTop.position.x = centerx - (this.size.x/2) - kickwidth;
        this.leftSnapTop.position.y = this.size.y;
        this.leftSnapTop.name = "LT";

        
        this.add(this.frontSnap);
        this.frontSnap.position.z = -zpos;
        this.frontSnap.position.x = centerx;


        //extra snap points for corner modules
        this.add(this.rightSnapFront);
        this.rightSnapFront.position.z = zpos + this.size.z;
        this.rightSnapFront.position.x = centerx + (this.size.x/2) + kickwidth;

        this.add(this.rightSnapFrontTop);
        this.rightSnapFrontTop.position.z = zpos + this.size.z;
        this.rightSnapFrontTop.position.x = centerx + (this.size.x/2) + kickwidth;
        this.rightSnapFrontTop.position.y = this.size.y;


        //reattach snap points
        for(var i = 0; i < this.snapPoints.length;i++){
            // console.log("snap parent", this.snapPoints[i].parent);
             this.scene.add(this.snapPoints[i]);
             this.snapPoints[i].visible = false;
         }
    }
    removeWallSnaps(){
        this.remove(this.backSnap);
        this.remove(this.leftSnap);
        this.remove(this.leftSnapTop);
        this.remove(this.rightSnap);
        this.remove(this.rightSnapTop);
        this.remove(this.frontSnap);
        this.remove(this.rightSnapFront);
        this.remove(this.rightSnapFrontTop);
    }

    getWallSnaps() {
        return [this.rightSnap, this.rightSnapTop, this.leftSnap, this.leftSnapTop,this.rightSnapFront,this.rightSnapFrontTop];
    }

}

export default WineRackCorner;