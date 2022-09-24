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

        this.getBottleCount();
        if (DD2022.showBottles) {
            this.showBottles();

        }
        DD2022.bottleCount();
    }

    getAccessories() {
        let accs = this.accessoryLayer.children;
        let layer = this.accessoryLayer;
        /*layer.children.forEach(function (item) {
            accs = accs.concat(item.getAccessories());
        });*/

        return accs;
    }

    showBottlesOld() {

        for (var i = 0; i < this.snapPoints.length; i++) {
            var bot;
            switch (this.snapPoints[i].snap) {

                case "mag":
                    bot = DD2022.sharedObjects.getMagnum();
                    break;
                case "champ":
                    bot = DD2022.sharedObjects.getChamps();
                    break;
                case "bot":
                    bot = DD2022.sharedObjects.getWine();
                    break;
                case "half":
                    bot = DD2022.sharedObjects.getHalf();
                    break;
                case "winebox":
                    bot = DD2022.sharedObjects.getWinebox();
                    break;
                default:
                    bot = "none";
                    break;
            }
        }
        if (bot != "none") {
            bot.snap = 'bot';
            bot.position.copy(this.snapPoints[i].position);
            bot.quaternion.copy(this.snapPoints[i].quaternion);
            this.accessoryLayer.add(bot);
        }
    }
    showBottles() {
        const types = ['champ', 'mag', 'bot', 'half', 'winebox'];
        let botType = null;
        let botCount = 0;
        let matrixArray = [];

        for (var i = 0; i < this.snapPoints.length; i++) {
            if (types.includes(this.snapPoints[i].snap)) {
                botType = this.snapPoints[i].snap;
                matrixArray.push(this.snapPoints[i].matrix);
            }
        }
        if (matrixArray.length < 1) return;
        let bot = DD2022.sharedObjects.getBottle(botType);
        let ref = bot.children[0];

        const mesh = new THREE.InstancedMesh(ref.geometry, ref.material, matrixArray.length);
        mesh.snap = 'bot';

        for (let i = 0; i < matrixArray.length; i++) {
            mesh.setMatrixAt(i, matrixArray[i]);
        }

        this.accessoryLayer.add(mesh);
    }

    hideBottles() {
        //remove any models using that snapGroup
        for (var q = this.accessoryLayer.children.length - 1; q > -1; q--) {
            if (this.accessoryLayer.children[q].snap == 'bot')
                this.accessoryLayer.children[q].geometry.dispose();
                this.accessoryLayer.remove(this.accessoryLayer.children[q]);

        }

    }
    getBottleCount() {

        for (var i = 0; i < this.snapPoints.length; i++) {
            switch (this.snapPoints[i].snap) {

                case "mag":
                    this.capacity.mag++;
                    break;
                case "champ":
                    this.capacity.champ++;
                    break;
                case "bot":
                    this.capacity.bot++;
                    break;
                case "half":
                    this.capacity.half++;
                    break;
                case "winebox":
                    this.capacity.bot += 12;
                    break;
                default:

                    break;
            }
        }



    }

    getWallSnaps() {
        return [this.rightSnap, this.rightSnapTop, this.leftSnap, this.leftSnapTop];
    }

}

export default WineRack;