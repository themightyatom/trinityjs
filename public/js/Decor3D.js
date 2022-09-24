
import * as THREE from '/three/build/three.module.js';
// import { RoomEnvironment } from '/three/examples/jsm/environments/RoomEnvironment.js';
import { RGBELoader } from '/three/examples/jsm/loaders/RGBELoader.js';
import { DecorOrbitControls } from '/js/DecorOrbitControls.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from '/three/examples/jsm/libs/stats.module.js';

import { GUI } from '/three/examples/jsm/libs/lil-gui.module.min.js';
import { VRButton } from '/three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from '/three/examples/jsm/webxr/XRControllerModelFactory.js';


class Decor3D {
    constructor(container, serverpath) {
        this.camera;
        this.scene;
        this.renderer;
        this.preview;
        this.controls;
        this.width3d;
        this.height3d;
        this.sunLight;
        this.container = container;
        this.server_path = serverpath;
        this.decorLayer;
        this.envLayer;
        this.controlLayer = null; //only add if used
        this.floor;
        //Orthographic Camera Parameters
        this.orthoHalfHeight = 5; //default half height of viewport in Orthographic mode, example 5 = 10m viewport height
        this.panX = 0;
        this.panZ = 0;
        this.grid;
        this.mode = '3d';
        this.pixelratio;
        this.elasticMat = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 1 });
        this.elasticLine = new THREE.Line(new THREE.BufferGeometry(), this.elasticMat);
        this.noRender = false;
        this.spotLight = null;


        this.dampTimeout;

        this.controller1;
        this.controller2;
		this.controllerGrip1;
        this.controllerGrip2;

        this.raycaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();
        this.intersected = [];

        this.group = new THREE.Group();
        this.line;
        this.testIntersects = [];
				
        this.movingObject = false;
        this.activeController = null;


        this.init(container);


    };

    init(cont) {

        this.container = document.getElementById(cont);

        //this.stats = new Stats();
        //this.container.appendChild(this.stats.dom);

        let width3d = this.container.offsetWidth;
        let height3d = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width3d, height3d);
        this.renderer.setPixelRatio(1.0);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        
        this.renderer.toneMappingExposure = 0.5;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        

        this.renderer.gammaFactor = 2.2;
        

        document.body.appendChild( VRButton.createButton( this.renderer ) );

        



        // const environment = new RoomEnvironment();
        // const pmremGenerator = new THREE.PMREMGenerator(renderer);

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0xf8f8f8);

        //vr controllers

				this.controller1 = this.renderer.xr.getController( 0 );
				this.controller1.addEventListener( 'selectstart', this.onSelectStart.bind(this) );
				this.controller1.addEventListener( 'selectend', this.onSelectEnd.bind(this) );
				this.scene.add( this.controller1 );

				this.controller2 = this.renderer.xr.getController( 1 );
				this.controller2.addEventListener( 'selectstart', this.onSelectStart.bind(this) );
				this.controller2.addEventListener( 'selectend', this.onSelectEnd.bind(this) );
				this.scene.add( this.controller2 );

				const controllerModelFactory = new XRControllerModelFactory();

				this.controllerGrip1 = this.renderer.xr.getControllerGrip( 0 );
				this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );
				this.scene.add( this.controllerGrip1 );

				this.controllerGrip2 = this.renderer.xr.getControllerGrip( 1 );
				this.controllerGrip2.add( controllerModelFactory.createControllerModel( this.controllerGrip2 ) );
				this.scene.add( this.controllerGrip2 );

                const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

				this.line = new THREE.Line( geometry );
				this.line.name = 'line';
				this.line.scale.z = 5;

				this.controller1.add( this.line.clone() );
				this.controller2.add( this.line.clone() );

                this.scene.add( this.group );


        this.addPerspectiveCamera();
        //this.scene.fog = new THREE.Fog(0xf8f8f8, 0, 1);



        this.decorLayer = new THREE.Object3D();
        this.decorLayer.name = "decorLayer";
        this.scene.add(this.decorLayer);
        this.scene.background = new THREE.Color(0xf8f8f8);
        

        this.envLayer = new THREE.Object3D();
        this.scene.add(this.envLayer);
        this.envLayer.name = "envLayer";

        this.drawLayer = new THREE.Object3D();
        this.scene.add(this.drawLayer);
        this.drawLayer.name = "drawLayer";

        this.controlLayer = new THREE.Object3D();
        this.scene.add(this.controlLayer);
        this.controlLayer.name = "controlLayer";

        let mat = new THREE.ShadowMaterial();
        mat.opacity = 0.02;
        let geom = new THREE.PlaneGeometry(10, 10);
        this.floor = new THREE.Mesh(geom, mat);
        this.floor.name = "ltvs__floor";
        this.floor.rotateX(-Math.PI / 2);
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
        this.envMap;


        let scope = this;
        new RGBELoader()
            .setDataType(THREE.HalfFloatType)
            .setPath(this.server_path + '/env/')
            .load('overhead.hdr', function (img) {

                scope.envMap = pmremGenerator.fromEquirectangular(img).texture;

                //scope.scene.background = scope.envMap;
                scope.scene.environment = scope.envMap;

                img.dispose();
                pmremGenerator.dispose();
            });


        //this.preview = new THREE.Object3D();
        //scene.add(preview);

        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();


        // controls.enabled = false;

        window.addEventListener('resize', this.onWindowResize.bind(this), false);




        //Lighting
        
        //let geo = new THREE.BoxGeometry(0.01, 0.01, 0.01);
        //let mate = new THREE.MeshBasicMaterial({ color: 0xffff00 });

        //this.lightTarget = new THREE.Mesh(geo, mate);
        this.lightTarget = new THREE.Object3D();
        this.lightTarget.name = "lightTarget";
        this.lightTarget.position.z = -2;
        this.lightTarget.position.x = 0.2;
        this.lightTarget.position.y = 0.1;
        var mapsize = 512;
        this.camera.add(this.lightTarget);




        this.sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);
        //this.scene.add(this.sunLight);
        // this.camera.add(this.sunLight);
        this.sunLight.name = "directionalLight1";
        this.sunLight.position.x = 0.1;
        this.sunLight.position.y = 3;
        this.sunLight.position.z = 0;

        let sunsize = 4;
        let lightDistance = 10;

        this.sunLight.castShadow = true;
        /* let directionalHelper = new THREE.DirectionalLightHelper(this.sunLight);
         this.scene.add(directionalHelper);*/
        //this.camera.add(this.sunLight.target);
        this.sunLight.target = this.lightTarget;
        //Set up shadow properties for the light
        this.sunLight.shadow.mapSize.width = mapsize;  // default
        this.sunLight.shadow.mapSize.height = mapsize; // default
        this.sunLight.shadow.camera.near = 0.0;    // default
        this.sunLight.shadow.camera.far = 50;     // default
        this.sunLight.shadow.camera.left = -sunsize;
        this.sunLight.shadow.camera.right = sunsize;
        this.sunLight.shadow.camera.top = sunsize;
        this.sunLight.shadow.camera.bottom = -sunsize;
        this.sunLight.shadow.bias = -0.0007;
        this.sunLight.shadow.normalBias = 0.04;
        this.sunLight.shadow.radius = 2;


        this.spotLight = new THREE.SpotLight(0xffffff, 1);
        this.spotLight.position.set(0.2, 0.5, 0);
        this.spotLight.angle = 0.6;
        this.spotLight.penumbra = 1;
        this.spotLight.decay = 2;
        this.spotLight.distance = 200;
        this.spotLight.target = this.lightTarget;

        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 512;
        this.spotLight.shadow.mapSize.height = 512;
        this.spotLight.shadow.camera.near = 0.1;
        this.spotLight.shadow.camera.far = 50;
        this.spotLight.shadow.focus = 1;
        this.spotLight.shadow.bias = -0.0007;
        this.spotLight.shadow.normalBias = 0.04;
        this.spotLight.shadow.radius = 2;
        this.camera.add(this.spotLight);

       /* const lightHelper = new THREE.SpotLightHelper( this.spotLight );
		this.scene.add( lightHelper );

		const shadowCameraHelper = new THREE.CameraHelper( this.spotLight.shadow.camera );
		this.scene.add( shadowCameraHelper ); */



        this.ambient = new THREE.AmbientLight(0xFFFFFF, 0.3);
        this.ambient.name = "ambient";
        this.scene.add(this.ambient);
       /* const size = 0.02;
        const widthSegments = 2;
        const heightSegments = 2;
        const depthSegments = 2;
        const boxGeometry = new THREE.BoxGeometry(
            size, size, size,
            widthSegments, heightSegments, depthSegments);
        const geometry = new THREE.EdgesGeometry(boxGeometry);

        const material = new THREE.LineBasicMaterial({ color: 0x000000 });*/



        // Init gui
/*
         const gui = new GUI();
         
          gui.add( this.renderer, 'toneMappingExposure', 0, 5); 
          gui.add( this.renderer, 'gammaFactor', 0, 5); 
          gui.add( this.spotLight, 'intensity', 0, 5); 
          gui.add( this.sunLight.position, 'x', -5, 5); 
          gui.add( this.sunLight.position, 'y', -5, 50); 
          gui.add(this.sunLight.shadow, 'bias', -0.1,0.1);
          gui.add(this.sunLight.shadow, 'radius', 0,100); 
          gui.addColor(this.sunLight, 'color'); 
          gui.add(this.ambient, 'intensity', 0, 1); 
        /*
        const gui = new GUI();



        gui.addColor(this.spotLight, 'color');

        gui.add(this.spotLight, 'intensity', 0, 2)


        gui.add(this.spotLight, 'distance', 50, 200);

        gui.add(this.spotLight, 'angle', 0, Math.PI / 3);

        gui.add(this.spotLight, 'penumbra', 0, 1);

        gui.add(this.spotLight, 'decay', 1, 2);

        gui.add(this.spotLight, 'focus', 0, 1);
        gui.add(this.spotLight.position, 'x', -5, 5);
        gui.add(this.spotLight.position, 'y', -5, 50);
        gui.add(this.lightTarget.position, 'y', -5, 50);
        gui.add(this.lightTarget.position, 'z', -5, 50);
        gui.add(this.lightTarget.position, 'x', -5, 50);


        gui.open();*/
        


        this.onWindowResize();
        this.animate();

    }
    onSelectStart( event ) {

        const controller = event.target;

        const object = this.getIntersections( controller );

        if ( object != null ) {

           
           // controller.attach( object );
            DD2022.decorRoomPlanner.setTarget(object);
            DD2022.decorRoomPlanner.startEdit();
            this.movingObject = true;
            this.activeController = controller;
            controller.userData.selected = object;

        }

    }

    onSelectEnd( event ) {

        const controller = event.target;

        if ( controller.userData.selected !== undefined ) {

            //const object = controller.userData.selected;
            //object.material.emissive.b = 0;
            //this.decorLayer.attach( object );
            DD2022.decorRoomPlanner.endEdit();
            controller.userData.selected = undefined;
            this.movingObject = false;

        }


    }

    getIntersections( controller ) {

        this.tempMatrix.identity().extractRotation( controller.matrixWorld );

        this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
       this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );

       this.testIntersects = this.raycaster.intersectObjects( this.decorLayer.children, true );

       let obj = null;
        if (this.testIntersects.length > 0) {
            for (var i = 0; i < this.testIntersects.length; i++) {
                if (this.testIntersects[i].object.name.substr(0, 3) != '_as') {
                    obj = this.testIntersects[i].object;
                    break;
                }
            }
        }



        if (obj) {
            let depth = 10; //prevent loop from continuing efter 10 levels
            let decobj = null;
            while (obj.parent) {
                if (obj.parent.snap_type == "surface") decobj = obj.parent;
                if (obj.parent.parent == this.decorLayer) {

                    return obj.parent;
                } else {
                    obj = obj.parent;
                }
                depth -= 1;
                if (depth < 1) { return null };
            }
        } else {
            return null;
        }

        //return this.raycaster.intersectObjects( this.decorLayer.children, true );

    }

    intersectObjects( controller ) {

        // Do not highlight when already selected

        if ( controller.userData.selected !== undefined ) return;

        const line = controller.getObjectByName( 'line' );
        const object = this.getIntersections( controller );

        if ( object != null ) {

           // object.material.emissive.r = 1;
            this.intersected.push( object );

            //line.scale.z = intersection.distance;

        } else {

            line.scale.z = 5;

        }

    }


    cleanIntersected() {

        while ( this.intersected.length ) {

            const object = this.intersected.pop();
             

        }

    }

    moveObject(){
        this.tempMatrix.identity().extractRotation( this.activeController.matrixWorld );

        this.raycaster.ray.origin.setFromMatrixPosition( this.activeController.matrixWorld );
       this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );
       DD2022.decorRoomPlanner.collisionTest(null,this.raycaster);
       //this.testIntersects = this.raycaster.intersectObjects( this.decorLayer.children, true );
    }


    addPerspectiveCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width3d / this.height3d, 0.1, 50);
        this.camera.position.set(0, 1, 10);
        this.scene.add(this.camera);
        if (this.controls == null) {
            this.controls = new DecorOrbitControls(this.camera, this.renderer.domElement);
            // this.controls.addEventListener('change', this.render.bind(this)); // use if there is no animation loop
            this.controls.minDistance = .1;
            this.controls.maxDistance = 20;
            this.controls.target.set(0, 1, 0);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.2;
            this.controls.enabled = true;
        } else {
            this.controls.object = this.camera;
        }

        if(this.spotLight != null){
            this.camera.add(this.spotLight);
            this.camera.add(this.lightTarget);
        } 
        this.controls.update();
    }
    removeControlLayer() {
        if (this.controlLayer != null) {
            this.scene.remove(this.controlLayer);
            this.controlLayer = null;
        }
        this.render();
    }


    onWindowResize() {
        this.width3d = this.container.offsetWidth;
        this.height3d = this.container.offsetHeight;
        //DecorManager.setWindowSize(width3d, height3d);
        this.camera.aspect = this.width3d / this.height3d;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width3d, this.height3d);

        if (this.mode == "2d") this.updateOrthoCam();
        this.render();

    }
    showGrid() {
        this.grid = new THREE.Object3D();
        this.scene.add(this.grid);
        this.grid.position.y = -0.05;
        var grid1 = new THREE.GridHelper(50, 250, 0xe7e4e4, 0xe7e4e4);
        //var grid1 = new THREE.GridHelper(50, 250, 0xe7f3ef, 0xe7f3ef);
        //var grid1 = new THREE.GridHelper(50, 250, 0x666666, 0x666666);
        grid1.position.y = -0.001;
        this.grid.add(grid1);
        let grid2 = new THREE.GridHelper(50, 50, 0x438998, 0xb7c2c5);
        //   grid = new THREE.GridHelper(50, 50, 0x438998, 0x999999);
        this.grid.add(grid2);
        this.scene.background = new THREE.Color(0xf9f9f9);
        this.render();
    }
    showHideGrid(value) {
        this.grid.visible = value;
    }
    /*animate() {
        requestAnimationFrame(this.animate.bind(this));

        //if(!this.noRender){
            this.render();
        //}
       // this.render();
        //this.stats.update();
       //if(this.controls.enabled) this.controls.update();
       
    }*/

    animate() {

        this.renderer.setAnimationLoop( this.render.bind(this) );

    }



    render() {

        this.cleanIntersected();

		this.intersectObjects( this.controller1 );
		this.intersectObjects( this.controller2 );

        if(this.movingObject) this.moveObject();

        this.renderer.render(this.scene, this.camera);

        if(this.controls.enabled) this.controls.update();
     
    }
    setCamPos(cam) {
        this.camera.position.copy(cam.position);
        this.camera.quaternion.copy(cam.quaternion);
        render();
    }
    grabScreenshot() {
        this.renderer.render(this.scene, this.camera);
        return this.renderer.domElement.toDataURL();
    }
    update() {
        this.render();
    }
    enterOrtographicMode() {
        this.controls.enabled = false;
        this.onWindowResize();
        let ratio = this.renderer.domElement.width / this.renderer.domElement.height; // ratio
        var halfWidth = (ratio * this.orthoHalfHeight);
        //            camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, oHeightHalf, -oHeightHalf, -oHeightHalf * 2, oHeightHalf * 2);
        this.camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, this.orthoHalfHeight, -this.orthoHalfHeight, 0, 100);
        this.camera.position.set(this.panX, 6, this.panZ);
        this.camera.lookAt(this.panX, 0, this.panZ);
        this.camera.updateProjectionMatrix();

        this.mode = '2d';
        
        /*this.controlLayer.add(this.elasticLine);
        this.elasticLine.geometry = new THREE.BufferGeometry();
        console.log("Camera", this.camera);*/
        let viewHeight = this.camera.top - this.camera.bottom;
        let viewPixelHeight = this.renderer.domElement.height;
        this.pixelratio = viewHeight / viewPixelHeight;
        // this.updateOrthoCam();

        if(this.spotLight != null){
            this.camera.add(this.spotLight);
            this.camera.add(this.lightTarget);
       }
    }
    zoomIn(amount = 0.8) {
        console.log("zoom in");
        this.orthoHalfHeight *= amount; // Orthographic height
        this.updateOrthoCam();

    }
    zoomOut(amount = 1.2) {
        console.log("zoom out");
        this.orthoHalfHeight *= amount; // Orthographic height
        this.updateOrthoCam();

    }
    updateOrthoCam() {
        let ratio = this.renderer.domElement.width / this.renderer.domElement.height; // ratio
        var halfWidth = (ratio * this.orthoHalfHeight);
        this.camera.left = -halfWidth;
        this.camera.right = halfWidth;
        this.camera.top = this.orthoHalfHeight;
        this.camera.bottom = -this.orthoHalfHeight;
        this.camera.updateProjectionMatrix();
        let viewHeight = this.camera.top - this.camera.bottom;
        let viewPixelHeight = this.renderer.domElement.height;
        this.pixelratio = viewHeight / viewPixelHeight;

        if (this.controlLayer != null) {
            this.controlLayer.children.forEach(cp => {
                if (cp.isControlPoint) {
                    cp.scale.x = cp.scale.y = cp.scale.z = this.orthoHalfHeight / 5;

                }
            })
        }
        this.render();
    }

    pan(x, z) {

        this.camera.position.x = this.panX + (x * this.pixelratio);
        this.camera.position.z = this.panZ + (z * this.pixelratio);
        this.render();
    }
    endPan() {
        this.panX = this.camera.position.x;
        this.panZ = this.camera.position.z;
    }

    refresh() {
        // if (!this.noRender) {
        this.controls.update();
        this.render();
        //}
    }
    forceRefresh() {
        this.controls.update();
        this.render();
    }
    startAnimate() {
        this.noRender = false;
      
        clearTimeout(this.dampTimeout);
    }
    stopAnimate() {
    clearTimeout(this.dampTimeout);
       this.dampTimeout = setTimeout(()=>{this.noRender = true;},500);

    }
    
}

export default Decor3D;





