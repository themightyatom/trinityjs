import * as THREE from '/three/build/three.module.js';

class TextPlane3D {

    constructor(){
    this.textcanvas = null;
    this.ctx;
    this.textTarget;
    this.textMachineCreated = false;
    this.resolution = 256;
    this.objectsToText = [];
    this.creating = false;
    this.textAlpha = 1;
    this.perimeter = 0;
    }



    
        addToTextQueue(textObj) {
            
            this.objectsToText.push(textObj);
            // start generation when first or single item added
            if (this.objectsToText.length == 1) this.checkQueue();
        }
        checkQueue() {
           
            if (!this.creating && this.objectsToText.length > 0) {
                var item = this.objectsToText.shift();
                this.makeText(item);
            }

        }
        createText(textObj) {
           // var textObj = { target: target, width: width, height: height, textString: textString, font: font, color:color,position:position };
          
            this.addToTextQueue(textObj);
        }
        makeText(item) {
            var target = item.target;
            let box = new THREE.Box3().setFromObject(item.target);
            let size = new THREE.Vector3();
            box.getSize(size);
            var width = size.x * 1000;
            var height = size.y * 1000;
            var textString = item.textString;
            var font = item.font;
            var color = item.color;
            var position = item.target.position;

            this.creating = true;
          


            //Calculate ratio
           /* if (width >= height) {
                var resW = resolution;
                var resH = resolution * (height / width);
            } else {
                var resW = resolution;
                var resH = resolution * (width / height);
            }*/



            //take screenshot to canvas
            if (this.textcanvas == null) {
                this.textcanvas = document.createElement("canvas");
                this.textcanvas.style.position = "absolute";
               // this.textcanvas.style.zIndex = 10000;
                document.body.append(this.textcanvas);
                this.textcanvas.id = "textCanvas";
            }
            this.textcanvas.width = width;
            this.textcanvas.height = height;
            let textHeight = height;
            let ctx = this.textcanvas.getContext("2d");
             ctx.beginPath();
             ctx.rect(0, 0, width, height);
             //ctx.fillStyle = "red";
             //ctx.fill();
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = textHeight + "px " + font;
            let posx = width/2;
            let posy = height/2; 
            // font based rectify
            if(font == "bkobiiimedium"){
                posy -= 5;
            }
            ctx.fillText(textString, posx, posy);


           // var superLongURI = textcanvas.toDataURL("image/png");




           // $('#previewTextImg').attr('src', superLongURI);

            //var img = document.getElementById("previewImg");


            var scope = this;


            //var targetCanvas = document.getElementById('textCanvas');
            //var texture = new THREE.Texture(targetCanvas);
            let texture = new THREE.Texture(this.textcanvas);
            texture.needsUpdate = true;
            //var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xFFFFFF, transparent: true, opacity: textAlpha });
            //mat.blending = THREE.MultiplyBlending;

            let mat = new THREE.MeshStandardMaterial({ map: texture, color: 0xFFFFFF, metalness:0, roughness:0.95,transparent: true, opacity: this.textAlpha });
            //mat.blending = THREE.MultiplyBlending;
            mat.side = THREE.DoubleSide;

            
            // mat.needsUpdate = true;
            let textPlane = new THREE.Mesh(new THREE.PlaneGeometry((width/1000) + this.perimeter, (height/1000) + this.perimeter), mat);


            //textPlane.rotation.x = (Math.PI / 2);

            //add to target

            //add extra layer to accomodate objects with gravity, that compare parent.parent id
            let text = new THREE.Object3D();
            text.position.copy(target.position);
           // text.quaternion.copy(target.quaternion);
           
            text.name = "legend";
            //remove any existing text object
            for(var t=target.parent.children.length-1;t >= 0;t--){
             
                if(target.parent.children[t].name == "legend"){
                    target.parent.remove(target.parent.children[t]);
                }
            }
            target.parent.add(text);
            //text.position.y = height/200;
            text.add(textPlane);

            this.creating = false;
            this.delayCreation();
            //scope.checkQueue();
        }
        delayCreation(){
            //setTimeout(this.checkQueue, 2000).bind(this);
            setTimeout(() => { this.checkQueue() }, 2000)
        }

    }

    export default TextPlane3D;


