import {MeshBasicMaterial} from '/three/build/three.module.js' ;

var SnapMaterial = new MeshBasicMaterial({color:0xFF0000,transparent:true,opacity:0.5});
SnapMaterial.depthTest = false


export default SnapMaterial;