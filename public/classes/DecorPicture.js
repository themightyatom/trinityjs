import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';

class DecorPicture extends DecorObject{
    constructor(){
        super();
        this.properties;
        this.imgData;
        this.imageCanvas;
        this.heightmin = 10;
        this.heightmax = 500;
        this.widthmax = 500;
        this.widthmin = 10;
        this.currentWidth = 100;
        this.currentHeight = 100;
        this.meshes = [];
        this.positions = [];
        this.refPositions = [];
        this.ratio = 1;
        this.showFrame = true;
        this.frame;
    }

    createPicture(){
        
        let scope = this;
        let texture = new THREE.TextureLoader().load(this.imgData,function(){
            
            
           let mat = new THREE.MeshStandardMaterial({map:texture});
           texture.flipY = false;
           scope.ratio = texture.image.naturalWidth/texture.image.naturalHeight;
            scope.imageCanvas.material = mat;
           scope.setHeight(100,true); // affect aspect ratio 
            render();
        });

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

    loadedcallback(){
        console.log("finished loading");
        let scope = this;
        this.scene.traverse(function (child) {

            if (child.isMesh){
                if (child.name == "picture") scope.imageCanvas = child;
                if (child.name == "frame") scope.frame = child;
               scope.meshes.push(child); 
               let pos = child.geometry.getAttribute('position').array;
                scope.positions.push(pos);
                scope.refPositions.push(pos.slice());
            }
        });

        this.createPicture();
    }

    setMetaData(dataStr){
        this.imgData = dataStr;
    }



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
            case "frame":
                
                this.showHideFrame();

            break;
            default:
                break;
        }
        this.registerProperties();
        
    }
    registerProperties(){
        this.properties =[
            {title:'frame', ui:'toggle', icon:'image_black_24dp.svg'},
            {title:'width', ui:'spinner', range:[this.widthmin, this.widthmax], value:this.currentWidth, icon:'width.svg'},
            {title:'height', ui:'spinner', range:[this.heightmin, this.heightmax], value:this.currentHeight, icon:'height.svg'},
            {title:'remove', ui:'alert_button'}
        ]
        this.signature.properties = this.properties;
    }

    setHeight(value, updateWidth = true) {
        //let value = document.getElementById('ltvs__height').value; //convert to meters
        if (value > this.heightmax) value = document.getElementById('ltvs__height').value = this.heightmax;
       // if (value < this.heightmin) value = document.getElementById('ltvs__height').value = this.heightmin;
        if (value < this.heightmin) return;
        let metervalue = value / 100;//convert to meters
        this.currentHeight = value;
        //set height = 2.5m
        for (var m = 0; m < this.meshes.length; m++) {
            for (var i = 1; i < this.positions[m].length; i += 3) {

                //if (this.refPositions[m][i] > 0.5) this.positions[m][i] = metervalue;
                if (this.refPositions[m][i] > 0.1) this.positions[m][i] = metervalue + (this.refPositions[m][i] - 1);
                
            }
        }
        let w = this.currentHeight * this.ratio;
        if(updateWidth){
            this.setWidth(w,false);
        } else{
            document.getElementById('ltvs__height').value = this.currentHeight;
        }
        this.update();

    }
    setWidth(value,updateHeight = true) {
        
        // let value = document.getElementById('ltvs__width').value; //convert to meters
         
         if (value > this.widthmax) value = document.getElementById('ltvs__width').value = this.widthmax;
        // if (value < this.widthmin) value = document.getElementById('ltvs__width').value = this.widthmin;
         if (value < this.widthmin) return;

         
         let metervalue = value / 100;//convert to meters
         this.currentWidth = value;
         for (var m = 0; m < this.meshes.length; m++) {
             for (var i = 0; i < this.positions[m].length; i += 3) {
                 if (this.refPositions[m][i] > 0.1) this.positions[m][i] = metervalue / 2 + (this.refPositions[m][i] - 0.5); //keep offsets, scurting boards, etc.
                 if (this.refPositions[m][i] < -0.1) this.positions[m][i] = -(metervalue / 2) + (this.refPositions[m][i] + 0.5);
             }
         }

         let h = this.currentWidth / this.ratio;
         if(updateHeight){
             this.setHeight(h,false);
         }else{
            document.getElementById('ltvs__width').value = this.currentWidth;
         }
         //move snap Points
        /* for(var sp=0; sp < this.snapPoints.length; sp++){
             // don't move planes. This would give a double translation
             if(!this.snapPoints[sp].isPlane){
                 if(this.refSnapPointPos[sp].x > 0.1) this.snapPoints[sp].position.x = metervalue/2 + (this.refSnapPointPos[sp].x - 1); 
                 if(this.refSnapPointPos[sp].x < -0.1) this.snapPoints[sp].position.x = -metervalue/2 + (this.refSnapPointPos[sp].x + 1); 
             }
         } */
         this.update();
 
 
     }

     showHideFrame(){
         
         if(this.frame.visible){
             this.frame.visible = false;
         }else{
             this.frame.visible = true;
         }
         render();
     }

     update(){
        for (var m = 0; m < this.meshes.length; m++) {
            this.meshes[m].geometry.attributes.position.needsUpdate = true;

            //Essential for subsequent raycasting. Otherwise uses original size
            this.meshes[m].geometry.computeBoundingBox();
            this.meshes[m].geometry.computeBoundingSphere();
           
        }
        render();
     }

}

export default DecorPicture