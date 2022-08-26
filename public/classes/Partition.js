import DecorObject from '/classes/DecorObject.js';

class Partition extends DecorObject{

    constructor(){
        super();
        this.classtype = 'Partition';
        this.isWallMounted = true;
        this.defaultWidth = 200;
        this.defaultHeight = 120;
        this.defaultDepth = 20;
        this.currentWidth = 200;
        this.currentHeight = 120;
        this.currentDepth = 20;
        this.currentWallColor = "#FFFFFF";
        this.widthmin = 10;
        this.widthmax = 30000;
        this.depthmin = 1;
        this.depthmax = 1000;
        this.heightmax = 5000;
        this.heightmin = 10;
        this.wallMesh = null;
        this.wallMat = null;
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
        let i;
        for(i=0;i<this.children.length;i++){
            if(this.children[i].name =="Scene"){

               this.wallMat = this.children[i].children[0].material;
               this.wallMesh = this.children[i].children[0];
            }
        }
        this.setUpDefaults();
    }

    setUpDefaults() {

        //set defaults
        this.setHeight(this.currentHeight);
        this.setWidth(this.currentWidth);
        this.setDepth(this.currentDepth);
        this.changeWallColor(this.currentWallColor);
        this.firstrun = false;

    }

    setProperty(prop,value){
        
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

    setWidth(value){
        
        if (value > this.widthmax) value = document.getElementById('ltvs__width').value = this.widthmax;
        if (value < this.widthmin) return;

        this.currentWidth = value;
        this.wallMesh.scale.x = this.currentWidth/this.defaultWidth;
        render();



    }
    setHeight(value){
        if (value > this.heightmax) value = document.getElementById('ltvs__height').value = this.heightmax;
        if (value < this.heightmin) return;

        this.currentHeight = value;
        this.wallMesh.scale.y = this.currentHeight/this.defaultHeight;
        render();
    }
    setDepth(value){
        if (value > this.depthmax) value = document.getElementById('ltvs__depth').value = this.depthmax;
        if (value < this.depthmin) return;

        this.currentDepth = value;
        this.wallMesh.scale.z = this.currentDepth/this.defaultDepth;
        render();
    }
    changeWallColor(value) {
        
        //let value = document.getElementById('ltvs__wallcolor').value;
        if (typeof value === 'string') {
            value = value.replace('#', '0x');
        }
        this.currentWallColor = value;
        this.wallMat.color.setHex(value);
       
    
        render();
    }

    getMetaData() {
        return this.currentWidth + "," + this.currentHeight + "," + this.currentDepth + "," + this.currentWallColor;
    }
    setMetaData(dataStr){
        let values = dataStr.split(',');
        this.currentWidth = values[0];
        this.currentHeight = values[1];
        this.currentDepth = values[2];
        this.currentWallColor = values[3];
    }




}

export default Partition