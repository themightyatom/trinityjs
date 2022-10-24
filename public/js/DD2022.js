

    import DecorManager from '/js/DecorManager.js';
    import DecorUI from '/js/DecorUI.js';
    import DecorButtonMenu from '/js/DecorButtonMenu.js';
    import DecorRoomPlanner from '/js/DecorRoomPlanner.js';
    import Decor3D from '/js/Decor3D.js'; 
    import DecorLogin from '/js/DecorLogin.js';
    import DecorIO from '/js/DecorIO.js';
    import DecorRoomMenu from '/js/DecorRoomMenu.js';
    import * as THREE from '/three/build/three.module.js';
    import EventManager from '/js/EventManager.js';
   


   class DD2022{
    constructor(){
        this.lang;
        // if run locally, use local resources. Add your server path to run locally and in production
        if(window.location.href.substring(0,16) != "http://localhost"){
            this.server_path = 'https://trinity.customshop.online';
        }else{
            this.server_path = '';  
        }
        
        this.decor3d = new Decor3D('ltvs_container',this.server_path);
    
        this.decorManager = new DecorManager(this.decor3d);
    
        this.decorLogin = new DecorLogin(this.setToken.bind(this));
        this.decorRoomPlanner = new DecorRoomPlanner(this.decor3d, this.decorManager);
        this.decorIO = new DecorIO();
        this.token = '';
        this.currentDesign = '';
        this.nextFunction = null;
        this.focusObj = null;
        this.ltvs_listHolder = null;
        window.render = this.renderScene.bind(this);
        this.roomEditMode = false;
        this.focusRoom = null; 
        this.refreshMenu = true;
        this.products = {};
        this.eventManager = new EventManager(this.decor3d.renderer.domElement); 
        this.eventManager.addAction({type:"down", target:this.decor3d , func:"startAnimate"});
        this.eventManager.addAction({type:"up", target:this.decor3d , func:"stopAnimate" });
        this.eventManager.addAction({type:"wheel", target:this.decor3d , func:"forceRefresh" });
        this.eventManager.addAction({ type: "down", target: this.decor3d.controls, func: "onPointerDown" });
		this.eventManager.addAction({ type: "cancel", target: this.decor3d.controls, func: "onPointerCancel" });
		this.eventManager.addAction({ type: "wheel", target: this.decor3d.controls, func: "onMouseWheel" })

        THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        
        };
        
        THREE.DefaultLoadingManager.onLoad = function ( ) {
        
            //console.log( 'Loading Complete!');
            render();
        
        };
        
        
        THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        
        };
        
        THREE.DefaultLoadingManager.onError = function ( url ) {
        
            console.log( 'There was an error loading ' + url );
        
        };
    }


       

    loadModel(id, lang, replace = true, matrix = null) {

        this.lang = lang;
        let scope = this;
        let sku = '0'; //not used if model id available
        fetch(this.server_path + '/clients/getmodel/' + lang + '/' + sku + '/' + id)
            .then(response => response.json())
            .then(data => {
                data.params.defaultAccessories = data.defaultAccessories;
                data.params.materials = data.materials;
                data.params.variants = data.variants;
                data.params.accessories = data.accessories;
                if (matrix != null) {
                    data.params.matrix = matrix.elements;
                } else if (scope.checkMode() > 0 && data.params.snap_type != "environment" && !replace) {
                    // data.params.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1];
                    //place infront of camera on floor
                    var direction = new THREE.Vector3();
                    this.decor3d.camera.getWorldDirection(direction);

                    let pos = new THREE.Vector3();
                    pos.add(direction.normalize().multiplyScalar(1)); //place 150cm from 0,0,0 in the direction of the camera
                    pos.y = 0;

                    let m = new THREE.Matrix4();
                    let q = new THREE.Quaternion();
                    // if wall in focus, place infront of wall with correct angle
                    if (this.currentFocusWall != null) {
                        console.log();
                        q.copy(this.currentFocusWall.mesh.quaternion);
                        this.currentFocusWall.mesh.getWorldDirection(direction);
                        pos.copy(this.currentFocusWall.mesh.position).add(direction.multiplyScalar(1));
                        pos.y = 0;
                    }
                    m.compose(pos, q, new THREE.Vector3(1, 1, 1));

                    data.params.matrix = m.toArray();
                }

                this.decorManager.addDecorObject(data.params, replace);


            })
    }
    loadMenu(group) {

        if (!this.refreshMenu) return;
        //prevent reselection
        if (group != this.focusObj) {
            DecorUI.createUI(group, true);
            DecorUI.createList(group);
            this.focusObj = group;
            this.decorManager.changeFocusGroup(group);
        }
    }
    enterRoomEditMode(room = null){

        if(!room){
            room = this.decor3d.envLayer.children[0];
        }
        this.roomEditMode = true;
        // make camera orthographic
        this.decor3d.enterOrtographicMode();
        this.roomMenu = new DecorRoomMenu(this.decor3d,room);
        this.decorRoomPlanner.stopSelectMoveTool();
        
        room.showhide2D(true); 
        room.setViewport(this.decor3d); // model needs viewport for mouse position calculations
        
        $("#buttonmenu").css("display", "none");
        $("#dialogboxholder").css("display", "none");
        this.stopSelector();
        this.focusRoom = room;
        render();
    }
    setFocusGroup(group){
        this.focusObj = group;
    }
    hideHighlight(){
        this.decorRoomPlanner.lowlight();
    }

    setProperty(prop,value){
        if(this.focusObj){
            this.focusObj.setProperty(prop,value);
            if(prop == "color"){
                this.decorRoomPlanner.lowlight();
            }
        }
    }

    renderScene(){
        //console.log("Called from outside");
        this.decor3d.update();
    }

    buttonCommands(command){
        console.log("command",command);
        switch(command){
            case 'user':
                this.decorLogin.login();
            break;
            case 'rp':
                this.decorRoomPlanner.loadProductMenu();
                break;
            case 'save':
                if(this.token.length > 10){
                    this.saveDesign();
                }else{
                    this.decorLogin.login();
                    this.nextFunction = this.saveDesign;
                }
                
                break;
                case 'room':
                    if(this.decor3d.envLayer.children[0]){
                        this.setMenuRefresh(true);
                        this.loadMenu( this.decor3d.envLayer.children[0]);
                        if(this.decor3d.envLayer.children[0].classtype == "DynamicRoom"){
                            if(this.decor3d.envLayer.children[0].pointArray.length < 1){
                                this.enterRoomEditMode();
                            }
                            this.decorManager.disable();
                         }
                    }else{
                        this.decorRoomPlanner.openCat(54);
                        //autostart edit?
                        this.decorRoomPlanner.startSelectMoveTool();
                    }
                    break;
            case 'img':
                //take snapshop
                this.saveAsImage();
            break;
            case 'list':
                this.listFullDesign();
            break;
            case 'share':
                this.shareDesign();
            break;
            case 'ar':
                //show preview...
               if(document.getElementById('ar-popup') != null) $('#ar-popup').remove();
                let cpopup = document.createElement('div');
                    cpopup.classList.add('centered-pop-up');
                    cpopup.setAttribute('id', 'ar-popup');
                    
                    let htmlStr = '<div class="message-container">'
                  
                    htmlStr += 'Generating Augmented Reality model...';
                    cpopup.innerHTML = htmlStr;
                  
                    let holder = document.getElementById('dialogboxholder');
                    holder.appendChild(cpopup);
                this.decorManager.exportSingle();
                break;
            case 'arios':
                this.decorManager.exportAR();
                break;
            default:
                break;
        }
        this.decorRoomPlanner.startSelectMoveTool()
    }

    listFullDesign(){
        DecorUI.listDesign(this.decor3d.decorLayer);
    }

    setToken(token){
        console.log("token", token);
        if(token.length > 10){
            this.decorButtonMenu.showloggedon(true);
            this.token = token;
            if(this.nextFunction != null){
                this.nextFunction();
                this.nextFunction = null;
            }
        }
    }

    addAccessory(model_class, id, snap, model, sku, snap_type, exclude, include, default_material, default_material_key, isGroupMember = false, metadata = ''){
        //special id for removal of all accessories with these snap types
        if(id == "remove_all"){
           
            let removeSnaps = snap.split(",");
            console.log("REMOVING", removeSnaps);
            for(var i=0;i<removeSnaps.length;i++){
                this.decorManager.removeSnapType(removeSnaps[i]);
            }
            this.decorManager.buildPartList();
        }else{
            let params = {model_class, id, snap, model, sku, snap_type, exclude, include, default_material, default_material_key,metadata};
            this.decorManager.addAccessory(params, isGroupMember);
        }
      //DecorUI.weedUnavailable();
    }

    createList(list,choosenFinish, checkmenu){
        DecorUI.createList(list,choosenFinish, checkmenu);
    };
    resetPartsList(){
        DecorUI.clearUI();
    }
    setMenuRefresh(value){
        this.refreshMenu = value;
    }
    sendToExportScript(){
        DecorUI.closeList();
        this.decorButtonMenu.closemenu();
        DecorUI.sendToExportScript(this.decor3d.decorLayer);
    }
    loadDesign(data){
        console.log(data);
        this.decorManager.masterReset();
       
        this.decorIO.closeSave();
        DecorUI.clearUI();
        this.decorIO.loadDesign(this.decor3d.decorLayer,this.decor3d.envLayer,data);
        this.decorRoomPlanner.startSelectMoveTool();
    }
    openDesign(id){
        
            fetch( this.server_path + '/designs/load/' + id)
            .then(response => response.json())
            .then(data =>{
                this.loadDesign(data);
            })
            this.currentDesign = id;
        
    }
    openSharedDesign(id, language = 'none'){
        this.lang = language;
        fetch( this.server_path + '/designs/shared/' + id)
        .then(response => response.json())
        .then(data =>{
            this.loadDesign(data);
        })
        this.currentDesign = id;
    
}

    saveDesign(){
        this.decorIO.saveDesign(this.decor3d.decorLayer,this.decor3d.envLayer);
    }
    shareDesign(){
       this.closeShareWindow();
      this.decorIO.saveDesign(this.decor3d.decorLayer,this.decor3d.envLayer,true);
      var str = 'design=' + this.currentDesign;
      fetch(this.server_path + '/designs/share', {
            method: 'POST',
         body: new URLSearchParams(str)
      })
      .then(response => response.json())
      .then(data =>{
          console.log("DATA", data);
          if(data.status == 1){
            //display link in popup
            let cpopup = document.createElement('div');
            cpopup.classList.add('centered-pop-up');
            cpopup.setAttribute('id', 'share-popup');
            let closebt = document.createElement('div');
            closebt.classList.add('pop-up-close');
            closebt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
            closebt.addEventListener('mouseup', function(){$('#share-popup').remove();});
            let htmlStr = '<div class="message-container"><textarea id="share-link" class="link-container" rows="2" cols="37">'
            //htmlStr += this.server_path + "/designs/share/" + data.id ;
            //remove any existing design reference
            let domain = window.location.hostname;
            let winloc = "https://"+ domain +"/pages/room-planner";
           // let winlocStripped = winloc.split('?')[0];
            htmlStr += winloc +  "?designid=" + data.id ;
            htmlStr += '</textarea>';
            htmlStr += '<button class="copy-but" onmousedown="DD2022.copyToClipboard(event)">COPY</button></div>';
            cpopup.innerHTML = htmlStr;
            cpopup.appendChild(closebt);
            let holder = document.getElementById('dialogboxholder');
            holder.appendChild(cpopup);
            var copyTextarea = document.getElementById('share-link');
            copyTextarea.focus();
            copyTextarea.select();
        }
      })
    }
    
copyToClipboard(e){

    e.stopPropagation();
    var copyTextarea = document.getElementById('share-link');
    copyTextarea.focus();
    copyTextarea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }
}
closeShareWindow(){
   let sw = document.getElementById('share-popup');
   if(sw) $(sw).remove();
}



    check(){
        console.log("checked");
    }

    removeItem(accInd){
        DecorUI.removeItem(accInd);
    }
    removeObject(decorLayerIndex){
        this.decor3d.decorLayer.remove(this.decor3d.decorLayer.children[decorLayerIndex]);
        render();
        DecorUI.listDesign(this.decor3d.decorLayer);
    }
    removeObjectAccessory(decorLayerIndex,accessoryIndex){
        let acc = DecorUI.getFromAccArray(accessoryIndex);
        let targs = this.decor3d.decorLayer.children[decorLayerIndex].removeAccessory(acc);
       /* targs.forEach(member =>{
            member.removeAccessory(acc);
        })*/
        render();
        DecorUI.listDesign(this.decor3d.decorLayer);
    }

    closeList(){
        DecorUI.closeList();
    }

    deleteSelected(){

        DecorUI.clearUI();

        if(this.focusObj.parent == this.decor3d.decorLayer){
            this.decor3d.decorLayer.remove(this.focusObj);
            render();
            return;
        }
        if(this.focusObj.parent == this.decor3d.envLayer){
            this.decor3d.envLayer.remove(this.focusObj);
            render();
            return;
        }
        
            this.decor3d.envLayer.children[0].removeAccessoryAt(this.decorRoomPlanner.currentTarget);
            this.decorRoomPlanner.endEdit();
            this.decor3d.envLayer.children[0].createHoles();
        
        this.resetPartsList();
    }
    checkMode(){
        //check if there are more than one object in the scene
            return this.decor3d.decorLayer.children.length + (this.decor3d.envLayer.children.length * 2);
        
    }

    closeSaveDialog(){
        this.decorIO.closeSave();
    }

    /*
    saveAsImage() {
        this.decor3d.renderer.preserveDrawingBuffer = true;
        render();
        const canvas =  document.getElementsByTagName("canvas")[0]
        const image = this.decor3d.renderer.domElement.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = image.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        a.download="lifetime.png";
        a.click();
      }
    */
   
    saveAsImage() {
        var imgData, imgNode;
        var strDownloadMime = "image/octet-stream";
        this.decor3d.renderer.preserveDrawingBuffer = true;
        render();
        try {
            var strMime = "image/jpeg";
            imgData = this.decor3d.renderer.domElement.toDataURL(strMime);

            this.saveFile(imgData.replace(strMime, strDownloadMime), "vinlagring.jpg");

        } catch (e) {
            console.log(e);
            return;
        }

    }

    saveFile(strData, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = filename;
            link.href = strData;
            link.click();
            document.body.removeChild(link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }

    assignMaterial(key, material,ext){
        this.decorManager.assignMaterial(key,material,ext);
    }

    getViewport(){
        return this.decor3d;
    }


    setSliderValue(slider,value){
      let s =  document.getElementById(slider);
      s.value = value;
      this.setProperty(slider ,value);
    }
    stopSelector(){
        this.decorRoomPlanner.stopSelectMoveTool();
    }
    returnTo3Dmode(){
        //after editing room in 2D
        this.decorManager.setCamera();
        DecorUI.createUI(this.focusObj.signature);
       
        this.focusObj.showhide2D(false);
        
        DecorUI.weedUnavailable();
        this.decorManager.enable();
        this.decorRoomPlanner.startSelectMoveTool();
        $("#buttonmenu").css("display", "block");
        $("#dialogboxholder").css("display", "block");

    }

    
  
   
    
  

   }

   export {DD2022};
    
  


