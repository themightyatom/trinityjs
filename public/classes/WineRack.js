import DecorObject from "/classes/DecorObject.js";
import * as THREE from '/three/build/three.module.js';

class WineRack extends DecorObject {
    constructor() {
        super();
        this.classtype = 'WineRack';
        this.capacity = { mag: 0, champ: 0, bot: 0, half: 0 };
    }

    registerProperties() {
        this.properties = [
            { title: 'remove', ui: 'alert_button' }
        ]
        //may be accessory without signature
        /* if( this.signature && this.signature.mirror == "1"){
             this.properties.push({title:'mirror', ui:'toggle', icon:'mirror.png'});
         }*/
        if (this.signature) this.signature.properties = this.properties;

        
    }

    getAccessories() {
        let accs = this.accessoryLayer.children;
        let layer = this.accessoryLayer;
        /*layer.children.forEach(function (item) {
            accs = accs.concat(item.getAccessories());
        });*/

        return accs;
    }



    getWallSnaps() {
        return [this.rightSnap, this.rightSnapTop, this.leftSnap, this.leftSnapTop];
    }

}

export default WineRack;