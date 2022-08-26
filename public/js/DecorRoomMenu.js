import * as THREE from '/three/build/three.module.js';

class DecorRoomMenu{
    constructor(window3d, room){

        this.window3d = window3d;
        this.targetRoom = room;
        this.translations ={
            da:{
                draw:"Tegn rum",
                zoom_in:"Zoom ind",
                zoom_out:"Zoom ud",
                add:"Tilføj punkt",
                remove:"Fjern punkt",
                close:"Luk",
                move:"Flyt punkt",
                pan:"Flyt tegning"
            },   
            en:{
                draw:"Draw room",
                zoom_in:"Zoom in",
                zoom_out:"Zoom out",
                add:"Add point",
                remove:"Remove point",
                close:"Close",
                move:"Move point",
                pan:"Pan drawing"
            },
            de:{
                draw:"Draw room",
                zoom_in:"Zoom in",
                zoom_out:"Zoom out",
                remove:"Remove point",
                add:"Add point",
                close:"Close",
                move:"Move point",
                pan:"Pan drawing"
            },
        };
        
        this.crosshair;
        this.mode = 'none';
        this.downX;
        this.downY;
        this.panning; 
        this.lastPointPos = null;
        this.panDownFunc = e => this.panDown(e);
        this.panUpFunc = e => this.panUp(e);
        this.addPointFunc = e => this.addPoint(e);
        this.elastic = e => this.followCursor(e);
        this.pointRemoval = e => this.removePoint(e);
        this.pointMove = e => this.movePoint(e);
        this.selectPoint = e => this.pointSelect(e);
        this.moveStop = e => this.stopMove(e);
        this.pointAdd = e => this.addExtraPoint(e);
        this.previewPoint = e => this.pointFollowCursor(e);
        this.highlighter = e => this.highlightPoint(e);
        this.wheelZoom = e => this.handleMouseWheel(e);
        this.selectedPoint = null;
        this.pointArray = [];
        this.hitCaster = new THREE.Raycaster();
        this.snap = 10; //10cm (100cm/10)
        this.drawUI();
    }

    drawUI(){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.buttonSelected{ background-color: #d7dfc7; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        
        //document.getElementById('someElementId').className = 'cssClass';


        const roommenu = document.createElement("div");
        roommenu.setAttribute("id", "roommenu");
        roommenu.classList.add("roommenu");
        const more_but = document.createElement("div");
        document.body.appendChild(roommenu);
    
    
        this.buttonArray = document.createElement("div");
        
        roommenu.appendChild(this.buttonArray);
    
        const draw_button = document.createElement("div");
        draw_button.setAttribute("id", "drawButton");
        draw_button.classList.add("buttonArrayButton");
        //draw_button.onmousedown = this.callback('ar').bind(this);
       // if(!this.iOS()){
            draw_button.addEventListener('mousedown', e => this.startDraw());
       // }else{
        //    draw_button.addEventListener('click', e => this.decorManager.exportAR()); 
        //}
        
        draw_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/mode_edit_outline_black_24dp.svg' width='24' height='24' title='" + this.getTranslation('draw') +"' >";
        
        const zoomIn_button = document.createElement("div");
        zoomIn_button.setAttribute("id", "zoomInButton");
        zoomIn_button.classList.add("buttonArrayButton");
        zoomIn_button.addEventListener('mousedown', e => this.zoomIn());
        zoomIn_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/zoom_in_black_24dp.svg' width='24' height='24' title='" + this.getTranslation('zoom_in') +"' >";
        
        const zoomOut_button = document.createElement("div");
        zoomOut_button.setAttribute("id", "zoomOutButton");
        zoomOut_button.classList.add("buttonArrayButton");
        zoomOut_button.addEventListener('mousedown', e => this.zoomOut());
        
        zoomOut_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/zoom_out_black_24dp.svg' width='24' height='24' title='" + this.getTranslation('zoom_out') +"' >";
    
        const pan_button = document.createElement("div");
        pan_button.setAttribute("id", "panButton");
        pan_button.classList.add("buttonArrayButton");
       // pan_button.innerHTML = "<svg  x= '0px ' y= '0px ' width= '24px ' height= '24px ' viewBox= '0 0 24 24 '><path id= 'Layer0_0_1_STROKES ' stroke= '" + this.iconColor + "' stroke-width= '2 ' stroke-linejoin= 'square' stroke-linecap= 'square' fill= 'none' d= 'M 14.15 2.75 L 2.55 2.75 2.55 21.5 13.65 21.5 13.65 16.15 21.4 16.15 21.4 2.75 19.9 2.75 16.2 7.4'/></svg>";
         pan_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/pan_tool_black_24dp.svg' width='24' height='24' title='" + this.getTranslation('pan') +"' >"
         pan_button.addEventListener('mousedown', e => this.panSetup());

         
       
        const add_button = document.createElement("div");
        add_button.setAttribute("id", "addButton");
        add_button.classList.add("buttonArrayButton");
        add_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/add_point.svg' width='24px' height='24px title='"  + this.getTranslation('add') + "'>";
        add_button.addEventListener('mousedown', e => this.startAddPoint());

        const remove_button = document.createElement("div");
        remove_button.setAttribute("id", "removeButton");
        remove_button.classList.add("buttonArrayButton");
        remove_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/remove_point.svg' width='24px' height='24px' title='"  + this.getTranslation('remove') + "'>";
        remove_button.addEventListener('mousedown', e => this.startRemovePoint());

        const move_button = document.createElement("div");
        move_button.setAttribute("id", "moveButton");
        move_button.classList.add("buttonArrayButton");
        move_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/move_point.svg' width='24px' height='24px' title='"  + this.getTranslation('move') + "'>";
        move_button.addEventListener('mousedown', e => this.startMovePoint());

        const close_button = document.createElement("div");
        close_button.setAttribute("id", "closeButton");
        close_button.classList.add("buttonArrayButton");
        close_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/cancel_red_24dp.svg' width='24px'  title='"  + this.getTranslation('close') + "'>";
        close_button.addEventListener('mousedown', e => this.close());
    
        // button order
        this.buttonArray.appendChild(draw_button);
        this.buttonArray.appendChild(move_button);
        this.buttonArray.appendChild(add_button);
        this.buttonArray.appendChild(remove_button);
        this.buttonArray.appendChild(zoomIn_button);
        this.buttonArray.appendChild(zoomOut_button);
        this.buttonArray.appendChild(pan_button);
        this.buttonArray.appendChild(close_button);
        DD2022.eventManager.addAction({type:"wheel", target:this, func:"handleMouseWheel"});

        
    }

    unhighligtButtons(){
        $( ".buttonArrayButton" ).removeClass("buttonSelected");
    }

    close(){
        this.removeAllListeners();
        $(this.window3d.renderer.domElement).css('cursor','auto');
        this.window3d.addPerspectiveCamera();
        this.targetRoom.hideControlLayer();
        $("#roommenu").remove();
        DD2022.returnTo3Dmode();
        DD2022.eventManager.removeWheelAction(this);
    }
    
    zoomIn(){
        this.window3d.zoomIn();
        this.targetRoom.redrawDimensions();
    }
    zoomOut(){
        this.window3d.zoomOut();
        this.targetRoom.redrawDimensions();

    }
    panSetup(){ 
        this.removeAllListeners();
        
        DD2022.eventManager.addAction({type:"down", target:this, func:"panDown", cursor:"grabbing"});
        DD2022.eventManager.addAction({type:"up", target:this, func:"panUp", cursor:"auto" });
        this.mode = "pan";
        $(this.window3d.renderer.domElement).css('cursor','grab');
    }
    panDown(pointerEvt) {
        
        
        DD2022.eventManager.addAction({type:"move", target:this, func:"pan", cursor:"grabbing" });
        this.downX = pointerEvt.clientX;
        this.downY = pointerEvt.clientY;
        this.targetRoom.clearDimensions();
    }
    panUp(pointerEvt) {
       
        DD2022.eventManager.removeAllActions(this);
        this.window3d.endPan();
       
        this.targetRoom.redrawDimensions();
    }
    pan(pointerEvt){
        this.window3d.pan(-(pointerEvt.clientX - this.downX),-((pointerEvt.clientY - this.downY)));
    }
    removeAllListeners(){

        DD2022.eventManager.removeAllActions(this);
        if(this.targetRoom) this.targetRoom.cancelAll();
        this.unhighligtButtons();
        
    }
    pointFollowCursor(e){
        this.targetRoom.updatePointPos(e);
    }

    addPoint(e){
        //let closing = this.hitTest(e)
       
     
        this.targetRoom.addControlPoint(e,this.snap,this); 
       /* this.lastPointPos = point;
        
        this.pointArray.push(point);
        this.targetRoom.drawWalls(this.pointArray);

        if(closing){
            this.removeAllListeners();
            this.dynamicRoom.removeElastic();
        }*/
        
    }
    startRemovePoint(){
        this.removeAllListeners();
     
        DD2022.eventManager.addAction({type:"down", target:this, func:"removePoint", cursor:"crosshair"});
        DD2022.eventManager.addAction({type:"move", target:this, func:"highlightPoint"});
        
        $(this.window3d.renderer.domElement).css('cursor','crosshair');
        $("#removeButton").addClass('buttonSelected');
    }
    highlightPoint(e){
        let point = this.hitTest(e);
        if(point){
            this.targetRoom.highlightPoint(point.parent);
        }else{
            this.targetRoom.lowlightAll();
        }
    }
    removePoint(e){
        let point = this.hitTest(e);
        if(point){
            this.targetRoom.removePoint(point.parent); //control point, not mesh
            this.window3d.removeControlPoint(point.parent);
            this.removeAllListeners();
        }
    }
    startAddPoint(){
        this.removeAllListeners();
        this.targetRoom.addPointPreview();
        $(this.window3d.renderer.domElement).css('cursor','crosshair');
        
        DD2022.eventManager.addAction({type:"down", target:this, func:"addExtraPoint", cursor:"crosshair"});
        DD2022.eventManager.addAction({type:"move", target:this, func:"pointFollowCursor"});
        $("#addButton").addClass('buttonSelected');
        
    }
    startMovePoint(){
        this.removeAllListeners();
   
        DD2022.eventManager.addAction({type:"down", target:this, func:"pointSelect", cursor:"move"});
        DD2022.eventManager.addAction({type:"move", target:this, func:"highlightPoint"});
        $(this.window3d.renderer.domElement).css('cursor','move');
        $("#moveButton").addClass('buttonSelected');
    }
    pointSelect(e){
        let point = this.hitTest(e);
        if(point){
            
            DD2022.eventManager.addAction({type:"move", target:this, func:"movePoint"});
            
            DD2022.eventManager.addAction({type:"up", target:this, func:"stopMove"});
            this.selectedPoint = point.parent;
        }
    }
    movePoint(e){
        this.targetRoom.movePoint(e,this.selectedPoint,this.snap);
    }
    stopMove(){
        console.log("stop!");
        this.removeAllListeners();
        this.startMovePoint();
    }
    startDraw(){
        this.removeAllListeners();
        if(this.targetRoom && this.targetRoom.pointArray.length > 0) return; //only when no room drawn
      
        DD2022.eventManager.addAction({type:"move", target:this, func:"followCursor"});
        DD2022.eventManager.addAction({type:"down", target:this, func:"addPoint"});
        this.mode = "draw";
        $(this.window3d.renderer.domElement).css('cursor','crosshair');
        this.targetRoom = this.window3d.envLayer.children[0];
        this.pointArray = [];
        $("#drawButton").addClass('buttonSelected');
    }
    followCursor(e){
       
      /* if(this.lastPointPos != null){
            this.window3d.drawElastic(e,this.lastPointPos.position,5);
       }*/
       this.targetRoom.drawElastic(e);
    }
    hitTest(e){
        var rect = this.window3d.container.getBoundingClientRect();
        let mouse = {};
        mouse.x = (e.clientX / rect.width) * 2 - 1;
        mouse.y = - (e.clientY / rect.height) * 2 + 1;
        this.hitCaster.setFromCamera(mouse, this.window3d.camera);
        const intersects = this.hitCaster.intersectObjects(this.targetRoom.controlLayer.children, true);
        if(intersects.length > 0){
            return intersects[0].object;
        }
        return false;
    }
    addExtraPoint(e){
        this.pointFollowCursor(e);
        this.targetRoom.addPoint();
    
    }
    getClosestPoint(A, B, P) {
        
        var D = B.clone().sub(A).normalize();
        var d = P.clone().sub(A).dot(D);
        var X = A.clone().add( D.clone().multiplyScalar( d ) ); 
        return X;
    }
 
    getTranslation(obj){
       
        let lang = ltvs__lang;
        
        if(lang == "none" || lang == undefined){
            lang = 'en';
        }
        return this.translations[lang][obj];
    }
    iOS() {
        return [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      } 
    handleMouseWheel(e) {
      

        
            if (e.deltaY > 0) {
                this.window3d.zoomIn(0.98);
            } else {
                this.window3d.zoomIn(1.02);
            }
            this.targetRoom.redrawDimensions();
        
        render();
    }
}

export default DecorRoomMenu