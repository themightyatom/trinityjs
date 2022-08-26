import * as THREE from '/three/build/three.module.js';

class DecorCADMenu{
    constructor(decor3d,room,planner){

        this.decor3d = decor3d;
        this.targetRoom = room;
        this.roomPlanner = planner;
        this.translations ={
            da:{
                draw:"Tegn rum",
                zoom_in:"Zoom ind",
                zoom_out:"Zoom ud",
                add:"Tilføj punkt",
                remove:"Fjern punkt",
                close:"Luk",
                move:"Flyt punkt",
                pan:"Flyt tegning",
                select:"Select"
            },   
            en:{
                draw:"Draw room",
                zoom_in:"Zoom in",
                zoom_out:"Zoom out",
                add:"Add point",
                remove:"Remove point",
                close:"Close",
                move:"Move point",
                pan:"Pan drawing",
                select:"Select"
            },
            de:{
                draw:"Draw room",
                zoom_in:"Zoom in",
                zoom_out:"Zoom out",
                remove:"Remove point",
                add:"Add point",
                close:"Close",
                move:"Move point",
                pan:"Pan drawing",
                select:"Select"
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
        this.wheelZoom = e => this.handleMouseWheel(e);
        this.selectedPoint = null;
        this.pointArray = [];
        this.hitCaster = new THREE.Raycaster();
        this.snap = 10; //10cm (100cm/10)
        this.drawUI();
        this.selectionMode = true;
    }

    drawUI(){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.buttonSelected{ background-color: #d7dfc7; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        
        //document.getElementById('someElementId').className = 'cssClass';


        const cadmenu = document.createElement("div");
        cadmenu.setAttribute("id", "cadmenu");
        cadmenu.classList.add("cadmenu");
        const more_but = document.createElement("div");
        document.body.appendChild(cadmenu);
    
    
        this.buttonArray = document.createElement("div");
        
        cadmenu.appendChild(this.buttonArray);

        const select_button = document.createElement("div");
        select_button.setAttribute("id", "selectButton");
        select_button.classList.add("buttonArrayButton");
        select_button.addEventListener('mousedown', e => this.startSelection());
        select_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/cursor-default-outline.svg' width='24' height='24' title='" + this.getTranslation('select') +"' >";
        
        
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
         pan_button.addEventListener('mouseup', e => this.panSetup());


        const close_button = document.createElement("div");
        close_button.setAttribute("id", "closeButton");
        close_button.classList.add("buttonArrayButton");
        close_button.innerHTML = "<img src= '" + DD2022.server_path + "/icons/cancel_red_24dp.svg' width='24px'  title='"  + this.getTranslation('close') + "'>";
        close_button.addEventListener('mousedown', e => this.close());
    
        // button order
        this.buttonArray.appendChild(select_button);
        this.buttonArray.appendChild(zoomIn_button);
        this.buttonArray.appendChild(zoomOut_button);
        this.buttonArray.appendChild(pan_button);
        this.buttonArray.appendChild(close_button);
        DD2022.eventManager.addAction({type:"wheel", target:this, func:"handleMouseWheel"});

        this.startSelection();

        
    }

    unhighligtButtons(){
        $( ".buttonArrayButton" ).removeClass("buttonSelected");
    }
    startSelection(){
        this.removeAllListeners();
        if(this.selectionMode){
            this.selectionMode = false;
            this.unhighligtButtons();
            this.roomPlanner.stopSelectMoveTool();
            this.roomPlanner.endEdit();
        }else{
            this.unhighligtButtons();
            $("#selectButton").addClass('buttonSelected');
            $(this.decor3d.renderer.domElement).css('cursor','auto');
            this.selectionMode = true;
            this.roomPlanner.startSelectMoveTool();
        }
    }

    close(){
        this.removeAllListeners();
        $(this.decor3d.renderer.domElement).css('cursor','auto');
       // this.targetRoom.hideControlLayer();
        $("#cadmenu").remove();
        DD2022.returnTo3Dmode();
        DD2022.eventManager.removeWheelAction(this);
    }
    
    zoomIn(){
        this.decor3d.zoomIn();
        //this.targetRoom.redrawDimensions();
        this.roomPlanner.drawObjectDimension();
    }
    zoomOut(){
        this.decor3d.zoomOut();
       // this.targetRoom.redrawDimensions();
       this.roomPlanner.drawObjectDimension();

    }
    panSetup(){ 
        this.removeAllListeners();
        this.roomPlanner.stopSelectMoveTool();
        this.roomPlanner.endEdit();
        DD2022.eventManager.addAction({type:"down", target:this, func:"panDown"});
        DD2022.eventManager.addAction({type:"up", target:this, func:"panUp" });
        this.mode = "pan";
        $(this.decor3d.renderer.domElement).css('cursor','grab');
        this.unhighligtButtons();
        this.selectionMode = false;
        $("#panButton").addClass('buttonSelected');
    }
    panDown(pointerEvt) {
         
        DD2022.eventManager.addAction({type:"move", target:this, func:"pan" });
        $(this.decor3d.renderer.domElement).css('cursor','grabbing');
        this.downX = pointerEvt.clientX;
        this.downY = pointerEvt.clientY;
        this.targetRoom.clearDimensions();
        $("#dimensions").html("");
    }
    panUp(pointerEvt) {
        this.removeAllListeners();
        this.decor3d.endPan();
        this.roomPlanner.drawObjectDimension();
       // this.targetRoom.redrawDimensions();
        $(this.decor3d.renderer.domElement).css('cursor','auto');
    }
    pan(pointerEvt){
        this.decor3d.pan(-(pointerEvt.clientX - this.downX),-((pointerEvt.clientY - this.downY)));
    }
    removeAllListeners(){

        DD2022.eventManager.removeAllActions(this);
        this.unhighligtButtons();
        
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
      
            if(this.selectionMode) return;
        
            if (e.deltaY > 0) {
                this.decor3d.zoomIn(0.98);
            } else {
                this.decor3d.zoomIn(1.02);
            }
            this.targetRoom.redrawDimensions();
        
        render();
    }
}

export default DecorCADMenu