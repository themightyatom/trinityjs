
import SquareRoom from '/classes/SquareRoom.js';



class SlantRoom extends SquareRoom {

    constructor() {
        super();
        this.skunkheight = 1;
        this.skunkangle = 45;
        this.currentSkunkHeight = 160;
        this.currentSkunkAngle = 45;
        this.classtype = 'SlantRoom';
        this.properties;
    };

    loadedcallback() {
        
        this.getVerts();
        this.registerProperties();
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
            case "skunkheight":
                this.setSkunkHeight(value);
            break;
            case "skunkangle":
                this.setSkunkAngle(value);
            break;
            case "color":
                this.changeWallColor(value);
            default:
                break;
        }
        
    }
    registerProperties(){
        this.properties =[
            {title:'width', ui:'spinner', range:[this.widthmin, this.widthmax], value:this.currentWidth, icon:'width.svg'},
            {title:'depth', ui:'spinner', range:[this.depthmin, this.depthmax], value:this.currentDepth,icon:'depth.svg'},
            {title:'height', ui:'spinner', range:[this.heightmin, this.heightmax], value:this.currentHeight, icon:'height.svg'},
            {title:'skunkheight', ui:'spinner', range:[10, this.heightmax], value:this.currentSkunkHeight, icon:'skunk_height.svg'},
            {title:'skunkangle', ui:'spinner', range:[0, 80], value:this.currentSkunkAngle, icon:'skunk_angle.svg'},
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
        this.currentWallColor = values[3];
        this.wallColor.setHex('0x' + values[3]);
        this.currentSkunkHeight = values[4];
        this.currentSkunkAngle = values[5];
    }

    setSkunkAngle(value){
        
        this.currentSkunkAngle = value;

        let topheight = (this.currentHeight - this.currentSkunkHeight)/100;

        let dist = (this.currentDepth/200) - (Math.tan(value * (Math.PI / 180)) * topheight);
        dist = Math.max(-this.currentDepth/200, dist);
        console.log("dist", dist, "depth", this.currentDepth/200);
           
        for (var m = 0; m < this.envmeshes.length; m++) {
            for (var i = 2; i < this.positions[m].length; i += 3) {

                if (this.refPositions[m][i] < -0.4 && this.refPositions[m][i] > -0.6 ){
                    console.log("verts found");
                    this.positions[m][i] = -dist;
                }  
                
            }
        }
     
        this.update();
    }
    setSkunkHeight(value){
         
         let metervalue = value / 100;//convert to meters
         this.currentSkunkHeight = value;
         //set height = 2.5m
         for (var m = 0; m < this.envmeshes.length; m++) {
             for (var i = 1; i < this.positions[m].length; i += 3) {
 
                 //Actual skunk height is 1.6 as default
                 if (this.refPositions[m][i] > 1.5 && this.refPositions[m][i] < 1.7) this.positions[m][i] = metervalue;
             }
         }

         this.update();
    }
    setUpDefaults(){
        
        //set defaults
        this.setHeight(this.currentHeight);
        this.setWidth(this.currentWidth);
        this.setDepth(this.currentDepth);
        this.setSkunkHeight(this.currentSkunkHeight);
        this.setSkunkAngle(this.currentSkunkAngle);
        this.firstrun = false;
    
    }
    getMetaData(){
        return String(this.currentWidth + ',' + this.currentDepth + ',' + this.currentHeight + ',' + this.wallColor.getHexString() + ',' + this.currentSkunkHeight + ',' + this.currentSkunkAngle);
    }



}

export default SlantRoom




