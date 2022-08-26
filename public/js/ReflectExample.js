import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js";

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js';

//

var Reflector = function ( geometry, options ) {

	THREE.Mesh.call( this, geometry );

	this.type = 'Reflector';

	var scope = this;

	options = options || {};

	var color = ( options.color !== undefined ) ? new THREE.Color( options.color ) : new THREE.Color( 0x7F7F7F );
	var textureWidth = options.textureWidth || 512;
	var textureHeight = options.textureHeight || 512;
	var clipBias = options.clipBias || 0;
	var shader = options.shader || Reflector.ReflectorShader;

	//

	var reflectorPlane = new THREE.Plane();
	var normal = new THREE.Vector3();
	var reflectorWorldPosition = new THREE.Vector3();
	var cameraWorldPosition = new THREE.Vector3();
	var rotationMatrix = new THREE.Matrix4();
	var lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
	var clipPlane = new THREE.Vector4();

	var view = new THREE.Vector3();
	var target = new THREE.Vector3();
	var q = new THREE.Vector4();

	var textureMatrix = new THREE.Matrix4();
	var virtualCamera = new THREE.PerspectiveCamera();

	var parameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat,
		stencilBuffer: false
	};

	var renderTarget = new THREE.WebGLRenderTarget( textureWidth, textureHeight, parameters );

	if ( ! THREE.MathUtils.isPowerOfTwo( textureWidth ) || ! THREE.MathUtils.isPowerOfTwo( textureHeight ) ) {

		renderTarget.texture.generateMipmaps = false;

	}

	var material = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.merge( [
			{
				opacity: {
					value: 1
				}
			},
			shader.uniforms
		] ),
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader
	} );

	material.uniforms[ "tDiffuse" ].value = renderTarget.texture;
	material.uniforms[ "color" ].value = color;
	material.uniforms[ "textureMatrix" ].value = textureMatrix;

	this.material = material;

	this.onBeforeRender = function ( renderer, scene, camera ) {

		reflectorWorldPosition.setFromMatrixPosition( scope.matrixWorld );
		cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld );

		rotationMatrix.extractRotation( scope.matrixWorld );

		normal.set( 0, 0, 1 );
		normal.applyMatrix4( rotationMatrix );

		view.subVectors( reflectorWorldPosition, cameraWorldPosition );

		// Avoid rendering when reflector is facing away

		if ( view.dot( normal ) > 0 ) return;

		view.reflect( normal ).negate();
		view.add( reflectorWorldPosition );

		rotationMatrix.extractRotation( camera.matrixWorld );

		lookAtPosition.set( 0, 0, - 1 );
		lookAtPosition.applyMatrix4( rotationMatrix );
		lookAtPosition.add( cameraWorldPosition );

		target.subVectors( reflectorWorldPosition, lookAtPosition );
		target.reflect( normal ).negate();
		target.add( reflectorWorldPosition );

		virtualCamera.position.copy( view );
		virtualCamera.up.set( 0, 1, 0 );
		virtualCamera.up.applyMatrix4( rotationMatrix );
		virtualCamera.up.reflect( normal );
		virtualCamera.lookAt( target );

		virtualCamera.far = camera.far; // Used in WebGLBackground

		virtualCamera.updateMatrixWorld();
		virtualCamera.projectionMatrix.copy( camera.projectionMatrix );

		// Update the texture matrix
		textureMatrix.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
		textureMatrix.multiply( virtualCamera.projectionMatrix );
		textureMatrix.multiply( virtualCamera.matrixWorldInverse );
		textureMatrix.multiply( scope.matrixWorld );

		// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
		// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
		reflectorPlane.setFromNormalAndCoplanarPoint( normal, reflectorWorldPosition );
		reflectorPlane.applyMatrix4( virtualCamera.matrixWorldInverse );

		clipPlane.set( reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant );

		var projectionMatrix = virtualCamera.projectionMatrix;

		q.x = ( Math.sign( clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
		q.y = ( Math.sign( clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
		q.z = - 1.0;
		q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

		// Calculate the scaled plane vector
		clipPlane.multiplyScalar( 2.0 / clipPlane.dot( q ) );

		// Replacing the third row of the projection matrix
		projectionMatrix.elements[ 2 ] = clipPlane.x;
		projectionMatrix.elements[ 6 ] = clipPlane.y;
		projectionMatrix.elements[ 10 ] = clipPlane.z + 1.0 - clipBias;
		projectionMatrix.elements[ 14 ] = clipPlane.w;

		// Render

		renderTarget.texture.encoding = renderer.outputEncoding;

		scope.visible = false;

		var currentRenderTarget = renderer.getRenderTarget();

		var currentXrEnabled = renderer.xr.enabled;
		var currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

		renderer.xr.enabled = false; // Avoid camera modification
		renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

		renderer.setRenderTarget( renderTarget );

		renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897

		if ( renderer.autoClear === false ) renderer.clear();
		renderer.render( scene, virtualCamera );

		renderer.xr.enabled = currentXrEnabled;
		renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

		renderer.setRenderTarget( currentRenderTarget );

		// Restore viewport

		var viewport = camera.viewport;

		if ( viewport !== undefined ) {

			renderer.state.viewport( viewport );

		}

		scope.visible = true;

	};

	this.getRenderTarget = function () {

		return renderTarget;

	};

};

Reflector.prototype = Object.create( THREE.Mesh.prototype );
Reflector.prototype.constructor = Reflector;

Reflector.ReflectorShader = {

	uniforms: {

		'color': {
			value: null
		},

		'tDiffuse': {
			value: null
		},

		'textureMatrix': {
			value: null
		}

	},

	vertexShader: [
		'uniform mat4 textureMatrix;',
		'varying vec4 vUv;',

		'void main() {',

		'	vUv = textureMatrix * vec4( position, 1.0 );',

		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'
	].join( '\n' ),

	fragmentShader: [
		'uniform vec3 color;',
		'uniform float opacity;',
		'uniform sampler2D tDiffuse;',
		'varying vec4 vUv;',

		'float blendOverlay( float base, float blend ) {',

		'	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',

		'}',

		'vec3 blendOverlay( vec3 base, vec3 blend ) {',

		'	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );',

		'}',

		'void main() {',

		'	vec4 base = texture2DProj( tDiffuse, vUv );',
		'	gl_FragColor = vec4( blendOverlay( base.rgb, color ), opacity );',

		'}'
	].join( '\n' )
};

// scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// camera
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;

var camera, scene, renderer;

var cameraControls;

var sphereGroup, smallSphere;

init();
animate();

function init() {

	var container = document.getElementById( 'container' );

	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	container.appendChild( renderer.domElement );

	// scene
	scene = new THREE.Scene();

	// camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.set( 0, 75, 160 );

	cameraControls = new OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 40, 0 );
	cameraControls.maxDistance = 400;
	cameraControls.minDistance = 10;
	cameraControls.update();

	//

	var planeGeo = new THREE.PlaneBufferGeometry( 100.1, 100.1 );

	// reflectors/mirrors

	var geometry = new THREE.CircleBufferGeometry( 40, 64 );
	var groundMirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: WIDTH * window.devicePixelRatio,
		textureHeight: HEIGHT * window.devicePixelRatio,
		color: 0x777777
	} );
	groundMirror.position.y = 0.5;
	groundMirror.rotateX( - Math.PI / 2 );
	scene.add( groundMirror );

	var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
	var verticalMirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: WIDTH * window.devicePixelRatio,
		textureHeight: HEIGHT * window.devicePixelRatio,
		color: 0x889999
	} );
	verticalMirror.position.y = 50;
	verticalMirror.position.z = - 50;
	verticalMirror.material.transparent = true;
	verticalMirror.material.uniforms.opacity.value = 0.2;
	scene.add( verticalMirror );


	sphereGroup = new THREE.Object3D();
	scene.add( sphereGroup );

	var geometry = new THREE.CylinderBufferGeometry( 0.1, 15 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x444444 } );
	var sphereCap = new THREE.Mesh( geometry, material );
	sphereCap.position.y = - 15 * Math.sin( Math.PI / 180 * 30 ) - 0.05;
	sphereCap.rotateX( - Math.PI );

	var geometry = new THREE.SphereBufferGeometry( 15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 );
	var halfSphere = new THREE.Mesh( geometry, material );
	halfSphere.add( sphereCap );
	halfSphere.rotateX( - Math.PI / 180 * 135 );
	halfSphere.rotateZ( - Math.PI / 180 * 20 );
	halfSphere.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );

	sphereGroup.add( halfSphere );

	var geometry = new THREE.IcosahedronBufferGeometry( 5, 0 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );
	smallSphere = new THREE.Mesh( geometry, material );
	scene.add( smallSphere );

	// walls
	var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
	planeTop.position.y = 100;
	planeTop.rotateX( Math.PI / 2 );
	scene.add( planeTop );

	var planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
	planeBottom.rotateX( - Math.PI / 2 );
	scene.add( planeBottom );

	var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) );
	planeFront.position.z = 50;
	planeFront.position.y = 50;
	planeFront.rotateY( Math.PI );
	scene.add( planeFront );

	var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ) );
	planeRight.position.x = 50;
	planeRight.position.y = 50;
	planeRight.rotateY( - Math.PI / 2 );
	scene.add( planeRight );

	var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000 } ) );
	planeLeft.position.x = - 50;
	planeLeft.position.y = 50;
	planeLeft.rotateY( Math.PI / 2 );
	scene.add( planeLeft );

	// lights
	var mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
	mainLight.position.y = 60;
	scene.add( mainLight );

	var greenLight = new THREE.PointLight( 0x00ff00, 0.25, 1000 );
	greenLight.position.set( 550, 50, 0 );
	scene.add( greenLight );

	var redLight = new THREE.PointLight( 0xff0000, 0.25, 1000 );
	redLight.position.set( - 550, 50, 0 );
	scene.add( redLight );

	var blueLight = new THREE.PointLight( 0x7f7fff, 0.25, 1000 );
	blueLight.position.set( 0, 50, 550 );
	scene.add( blueLight );

}

function animate() {

	requestAnimationFrame( animate );

	var timer = Date.now() * 0.01;

	sphereGroup.rotation.y -= 0.002;

	smallSphere.position.set(
		Math.cos( timer * 0.1 ) * 30,
		Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
		Math.sin( timer * 0.1 ) * 30
	);
	smallSphere.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
	smallSphere.rotation.z = timer * 0.8;

	renderer.render( scene, camera );

}