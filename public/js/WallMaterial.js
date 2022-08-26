import {MeshStandardMaterial,TextureLoader,RepeatWrapping,Vector2} from '/three/build/three.module.js' ;


//var SnapMaterial = new MeshBasicMaterial({color:0x64a067,transparent:true,opacity:0.5,side:DoubleSide});
const texture = new TextureLoader().load( DD2022.server_path + '/textures/paper-normal.png' );
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;

const textureR = new TextureLoader().load( DD2022.server_path + '/textures/paper-rough.jpg' );
textureR.wrapS = RepeatWrapping;
textureR.wrapT = RepeatWrapping;
var WallMaterial = new MeshStandardMaterial({color:0x000000,normalMap:texture,roughnessMap:textureR});
WallMaterial.normalScale = new Vector2(5,5);


export default WallMaterial;