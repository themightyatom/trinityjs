import {MeshBasicMaterial} from '/three/build/three.module.js' ;
import {DoubleSide} from '/three/build/three.module.js' ;

var SnapMaterialDouble = new MeshBasicMaterial({color:0x64a067,transparent:true,opacity:0.5,side:DoubleSide});
//var SnapMaterialDouble = new MeshBasicMaterial({color:0x64a067,transparent:true,opacity:0.5});
SnapMaterialDouble.depthTest = false


export default SnapMaterialDouble;