

import DecorManager from '/js/DecorManager.js';
import DecorUI from '/js/DecorUI.js';
import DecorButtonMenuPRO from '/js/DecorButtonMenuPRO.js';
import DecorRoomPlanner from '/js/DecorRoomPlanner.js';
import Decor3D from '/js/Decor3D.js';
import DecorLogin from '/js/DecorLogin.js';
import DecorIO from '/js/DecorIO.js';
import DecorRoomMenu from '/js/DecorRoomMenu.js';
import DecorModelUpload from '/js/DecorModelUpload.js';
import DecorObject from '/classes/DecorObject.js';
import * as THREE from '/three/build/three.module.js';
import { DecorGLTFExporter } from '/js/DecorGLTFExporter.js';
import DecorCADMenu from '/js/DecorCADMenu.js';
import EventManager from '/js/EventManager.js';
import DialogBox from '/js/DialogBox.js';
import SharedObjects from '/js/SharedObjects.js';
import DecorBrowser from '/js/DecorBrowser.js';
import Translations from '/js/Translations.js';
import MathEx from '/js/MathEx.js';



class DD2022 {
    constructor() {
        this.lang;
        this.translations = new Translations();
        console.log("WINDOW", window.location.href);
        if (window.location.href.substring(0, 16) != "http://localhost") {
            this.server_path = 'https://vinlagringse.customshop.online';
        } else {
            this.server_path = '';
        }
        console.log("SERVER", this.server_path);
        this.decor3d = new Decor3D('ltvs_container', this.server_path);

        this.decorManager = new DecorManager(this.decor3d);
        this.decorButtonMenu = new DecorButtonMenuPRO(this.decor3d, this.buttonCommands.bind(this), this.decorManager);
        this.uploader = new DecorModelUpload();

        this.decorLogin = new DecorLogin(this.setToken.bind(this));
        this.decorRoomPlanner = new DecorRoomPlanner(this.decor3d, this.decorManager);
        this.decorIO = new DecorIO();
        this.roomMenu;
        this.token = '';
        this.currentDesign = '';
        this.nextFunction = null;
        this.focusObj = null;
        this.ltvs_listHolder = null;
        this.decor3d.showGrid();
        window.render = this.renderScene.bind(this);
        window.saveSnapshot = this.saveSnapshot.bind(this);
        this.roomEditMode = false;
        this.focusRoom = null;
        this.sharepath = "/designs/view/";
        this.startDesign = false;
        this.refreshMenu = true;
        this.cadMode = false;
        this.showDimensions = true;
        this.cadMenu;
        this.showBottles = false;
        this.sharedObjects = new SharedObjects();
        this.decorBrowser = new DecorBrowser();
        this.products = {};
        this.currentViewIndex = -1;
        this.currentFocusWall = null;

        this.showingTitles = false;
        this.units = "centimeters";
        

        setTimeout(this.loadSnapshot.bind(this), 1000);
        setTimeout(this.autoLogin.bind(this), 500);
        setTimeout(this.importPrices.bind(this), 2000);
        this.eventManager = new EventManager(this.decor3d.renderer.domElement);
        this.eventManager.addAction({ type: "down", target: this.decor3d, func: "startAnimate" });
        this.eventManager.addAction({ type: "up", target: this.decor3d, func: "stopAnimate" });
        this.eventManager.addAction({ type: "wheel", target: this.decor3d, func: "forceRefresh" });
        this.eventManager.addAction({ type: "down", target: this.decor3d.controls, func: "onPointerDown" });
        this.eventManager.addAction({ type: "leave", target: this.decor3d.controls, func: "onPointerCancel" });
        this.eventManager.addAction({ type: "wheel", target: this.decor3d.controls, func: "onMouseWheel" });

        window.onkeydown = e => this.checkKey(e);
        window.onkeyup = e => this.checkUpKey(e);

        this.shiftkey = false;
        this.duplicationCount = 1;

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
    enterRoomEditMode(room = null) {

        if (!room) {
            room = this.decor3d.envLayer.children[0];
        }
        this.roomEditMode = true;
        // make camera orthographic
        this.decor3d.enterOrtographicMode();
        this.roomMenu = new DecorRoomMenu(this.decor3d, room);
        this.decorRoomPlanner.stopSelectMoveTool();

        room.showhide2D(true);
        room.setViewport(this.decor3d); // model needs viewport for mouse position calculations

        $("#buttonmenu").css("display", "none");
        $("#dialogboxholder").css("display", "none");
        this.stopSelector();
        this.focusRoom = room;
        render();
    }
    enterCADmode(){
        let room = null;
        if(this.decor3d.envLayer.children.length > 0) room = this.decor3d.envLayer.children[0];
        

        if(this.cadMode){
            this.cadMode = false;
            this.cadMenu.close();
        }else{ 
            this.cadMenu = new DecorCADMenu(this.decor3d, room,this.decorRoomPlanner);
            this.cadMode = true;
            // show room from above, with pan and zoom tools. Show position of selected
            this.decor3d.enterOrtographicMode();
            
        }
        this.decorRoomPlanner.endEdit();
        render();
        
     
    }
    setFocusGroup(group) {
        this.focusObj = group;
    }
    getViewport() {
        return this.decor3d;
    }
    hideHighlight() {
        this.decorRoomPlanner.lowlight();
    }

    setProperty(prop, value) {
        if (this.focusObj) {
            this.focusObj.setProperty(prop, value);
            if (prop == "color") {
                this.decorRoomPlanner.lowlight();
            }
        }
    }

    renderScene() {

        this.decor3d.render();
    }

    buttonCommands(command) {
        console.log("command", command);
        switch (command) {
            case 'user':
                this.decorLogin.login();
                break;
            case 'browse':
                this.decorBrowser.loadProductMenu();
                break;
            case 'save':
                if (this.token.length > 10) {
                    this.saveDesign();
                } else {
                    this.decorLogin.login();
                    this.nextFunction = this.saveDesign;
                }

                break;
            case 'room':
                if (this.decor3d.envLayer.children[0]) {
                    this.setMenuRefresh(true);
                    this.loadMenu(this.decor3d.envLayer.children[0]);
                    if (this.decor3d.envLayer.children[0].classtype == "DynamicRoom") {
                        if (this.decor3d.envLayer.children[0].pointArray.length < 1) {
                            this.enterRoomEditMode();
                        }
                        this.decorManager.disable();
                    }
                } else {
                    this.decorBrowser.openCat(54, true);
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
                if (this.decor3d.decorLayer.children.length < 1) return; // don't try if nothing added
                this.decorRoomPlanner.lowlight();
                if (document.getElementById('ar-popup') != null) $('#ar-popup').remove();
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
            case 'upload':
                this.uploadFile();
                break;
            case 'download':
                // this.downloadDVS();
                this.downloadModel();
                break;
            case 'new':
                this.newPlanPrompt();
                break;
            case 'cad':
                this.enterCADmode();
                break;
            case 'bottles':
                this.showHideBottles();
                break;
            case 'print':
                this.shareDesign(true); //print?
                break;
            case 'duplicate':
                this.duplicateSelected();
                break;
            case 'toggle_titles':
                this.toggle_titles();
                break;
            case 'language':
                this.setLanguage();
                break;
            default:
                break;
        }

    }

    toggle_titles(){
        if(this.showingTitles){
            $(".menu-lable").css('display', 'none')
            this.showingTitles = false;
        }else{
            $(".menu-lable").css('display', 'block')
            this.showingTitles = true;
        }
    }

    setLanguage(){
        this.lang = ltvs__lang;
        console.log("language is now", this.lang);
        this.bottleCount();
        if(this.focusObj) {
            let g = this.focusObj;
            this.focusObj = null;
            this.loadMenu(g);
        }
        this.decorButtonMenu.drawUI();
        if(this.showingTitles){
            this.showingTitles = false;
            this.toggle_titles();
        }
    }


    showHideBottles() {
        if (this.showBottles) {
            this.showBottles = false;
            for (var i = 0; i < this.decor3d.decorLayer.children.length; i++) {
                let obj = this.decor3d.decorLayer.children[i];
                if (obj.classtype.substring(0, 8) == "WineRack") {

                    obj.hideBottles();
                }
            }
        } else {
            this.showBottles = true;
            for (var i = 0; i < this.decor3d.decorLayer.children.length; i++) {
                let obj = this.decor3d.decorLayer.children[i];
                if (obj.classtype.substring(0, 8) == "WineRack") {
                    obj.showBottles();
                }
            }
            let cap = this.bottleCount();


        }
        this.renderScene();
    }

    bottleCount() {
        let totalCapacity = { mag: 0, champ: 0, bot: 0, half: 0 };
        console.log("checking bottle capacity");
        for (var i = 0; i < this.decor3d.decorLayer.children.length; i++) {
            let obj = this.decor3d.decorLayer.children[i];
            if (obj.classtype.substring(0, 8) == "WineRack") {
                let cap = obj.capacity;
                totalCapacity.mag += cap.mag;
                totalCapacity.champ += cap.champ;
                totalCapacity.bot += cap.bot;
                totalCapacity.half += cap.half;
            }
        }
        let dialog = new DialogBox('bottle_count', null, { right: '10px', bottom: '10px' });
        let htmlstr = '<div style="text-align: center;padding-bottom: 10px;">'+ this.getTranslation('capacity') +'</div><div style="font-size: smaller;">';
        htmlstr += '<div>' + this.getTranslation('winebottles') +': ' + totalCapacity.bot + '</div>';
        htmlstr += '<div>' + this.getTranslation('halfbottles') +': ' + totalCapacity.half + '</div>';
        htmlstr += '<div>' + this.getTranslation('magnumbottles') +': ' + totalCapacity.mag + '</div>';
        htmlstr += '<div>' + this.getTranslation('champagnebottles') +': ' + totalCapacity.champ + '</div></div>';
        dialog.setHTMLContents(htmlstr);
        return htmlstr;
    }

    getTranslation(obj){
       
        let lang = this.lang;
        
        if(lang == "none" || lang == undefined){
            lang = 'se';
        }
        return this.translations[lang][obj];
    }





    newPlan(keeproom) {
        //prompt for save
        this.decorManager.masterReset(keeproom);
        this.bottleCount();
    }
    newPlanPrompt() {
        let dialog = new DialogBox('new_plan', 'newplan.html');
    }

    listFullDesign() {
        DecorUI.listDesign(this.decor3d.decorLayer);
    }

    setToken(token) {

        if (token.length > 10) {
            this.decorButtonMenu.showloggedon(true);
            this.token = token;
            if (this.nextFunction != null) {
                this.nextFunction();
                this.nextFunction = null;
            }
        }
    }

    addAccessory(model_class, id, snap, model, sku, snap_type, exclude, include, default_material, default_material_key, isGroupMember = false, metadata = '') {
        //special id for removal of all accessories with these snap types
        if (id == "remove_all") {

            let removeSnaps = snap.split(",");
            console.log("REMOVING", removeSnaps);
            for (var i = 0; i < removeSnaps.length; i++) {
                this.decorManager.removeSnapType(removeSnaps[i]);
            }
            this.decorManager.buildPartList();
        } else {
            let params = { model_class, id, snap, model, sku, snap_type, exclude, include, default_material, default_material_key, metadata };
            this.decorManager.addAccessory(params, isGroupMember);
        }
        //DecorUI.weedUnavailable();
    }

    createList(list, choosenFinish, checkmenu) {
        if (!this.refreshMenu) return;
        DecorUI.createList(list, choosenFinish, checkmenu);
    };
    resetPartsList() {
        DecorUI.clearUI(true);
    }
    sendToExportScript() {
        DecorUI.closeList();
        this.decorButtonMenu.closemenu();
        DecorUI.sendToExportScript(this.decor3d.decorLayer);
    }
    loadDesign(data) {
        console.log("data:", data);
        this.startDesign = true;
        this.decorManager.masterReset();

        this.decorIO.closeSave();
        DecorUI.clearUI();
        this.setMenuRefresh(false);
        this.decorIO.loadDesign(this.decor3d.decorLayer, this.decor3d.envLayer, data);
        this.decorRoomPlanner.startSelectMoveTool();
    }
    setMenuRefresh(value) {
        this.refreshMenu = value;
    }
    openDesign(id) {

        fetch(this.server_path + '/designs/load/' + id)
            .then(response => response.json())
            .then(data => {
                this.loadDesign(data);
            })
        this.currentDesign = id;

    }
    openSharedDesign(id, language = 'none') {
        this.lang = language;
        fetch(this.server_path + '/designs/shared/' + id)
            .then(response => response.json())
            .then(data => {
                this.loadDesign(data);
            })
        this.currentDesign = id;

    }

    saveDesign() {
        this.decorIO.saveDesign(this.decor3d.decorLayer, this.decor3d.envLayer);
    }
    shareDesign(print = false) {
        this.closeShareWindow();
        let scope = this;
        this.decorIO.saveDesign(this.decor3d.decorLayer, this.decor3d.envLayer, true);
        var str = 'design=' + this.currentDesign;
        fetch(this.server_path + '/designs/share', {
            method: 'POST',
            body: new URLSearchParams(str)
        })
            .then(response => response.json())
            .then(data => {
                console.log("DATA", data);
                if (data.status == 1) {

                    if(print){
                        scope.printOut("https://" + window.location.hostname + this.sharepath + data.id);
                        return;
                    }

                    if ('share' in navigator) {
                        navigator
                            .share({
                                title: 'Check out this design',
                                url: "https://" + window.location.hostname + this.sharepath + "?designid=" + data.id,
                            })
                            .then(() => {
                                console.log('Callback after sharing');
                            })
                            .catch(console.error);
                    } else {



                        //display link in popup
                        let cpopup = document.createElement('div');
                        cpopup.classList.add('centered-pop-up');
                        cpopup.setAttribute('id', 'share-popup');
                        let closebt = document.createElement('div');
                        closebt.classList.add('pop-up-close');
                        closebt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
                        closebt.addEventListener('mouseup', function () { $('#share-popup').remove(); });
                        let htmlStr = '<div class="message-container"><textarea id="share-link" class="link-container" rows="2" cols="37">'
                        //htmlStr += this.server_path + "/designs/share/" + data.id ;
                        //remove any existing design reference
                        let domain = window.location.hostname;
                        let winloc = "https://" + domain + this.sharepath;
                        // let winlocStripped = winloc.split('?')[0];
                        htmlStr += winloc + "?designid=" + data.id;
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
                }
            })
    }

    copyToClipboard(e) {

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
    closeShareWindow() {
        let sw = document.getElementById('share-popup');
        if (sw) $(sw).remove();
    }



    check() {
        console.log("checked");
    }

    removeItem(accInd) {
        DecorUI.removeItem(accInd);
    }
    removeObject(decorLayerIndex) {
        this.decor3d.decorLayer.remove(this.decor3d.decorLayer.children[decorLayerIndex]);
        render();
        DecorUI.listDesign(this.decor3d.decorLayer);
    }
    removeObjectAccessory(decorLayerIndex, accessoryIndex) {
        let acc = DecorUI.getFromAccArray(accessoryIndex);
        let targs = this.decor3d.decorLayer.children[decorLayerIndex].removeAccessory(acc);
        /* targs.forEach(member =>{
             member.removeAccessory(acc);
         })*/
        render();
        DecorUI.listDesign(this.decor3d.decorLayer);
    }

    closeList() {
        DecorUI.closeList();
    }

    deleteSelected() {

        if (!this.focusObj) return;

        DecorUI.clearUI(true);
        let len = this.decorRoomPlanner.multiSelected.length;

        if (this.focusObj.parent == this.decor3d.decorLayer && len < 1) {

            this.decor3d.decorLayer.remove(this.focusObj);
            this.decorRoomPlanner.endEdit();

            this.focusObj = null;
            render();
            this.bottleCount();
            return;
        }
        if (this.focusObj.parent == this.decor3d.envLayer) {
            this.decor3d.envLayer.remove(this.focusObj);
            this.focusObj = null;
            render();
            return;
        }


        if (len > 0) {
            var i;
            for (i = 0; i < len; i++) {
                if (this.decorRoomPlanner.multiSelected[i].parent == this.decor3d.decorLayer) {
                    this.decor3d.decorLayer.remove(this.decorRoomPlanner.multiSelected[i]);
                }
            }
            this.decorRoomPlanner.endEdit();
            return;
        }

        this.decor3d.envLayer.children[0].removeAccessoryAt(this.decorRoomPlanner.currentTarget);
        this.decor3d.envLayer.children[0].createHoles();
        this.decor3d.controls.enabled = true;
        this.resetPartsList();

        this.focusObj = null;

    }
    checkMode() {
        //check if there are more than one object in the scene
        //console.log("CHECK",this.decor3d.decorLayer.children.length + (this.decor3d.envLayer.children.length * 2) );
        return this.decor3d.decorLayer.children.length + (this.decor3d.envLayer.children.length * 2);

    }

    closeSaveDialog() {
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

    saveAsImage(savefile = true) {
        var imgData, imgNode;
        var strDownloadMime = "image/octet-stream";
        this.decor3d.renderer.preserveDrawingBuffer = true;
        render();
        try {
            var strMime = "image/jpeg";
            imgData = this.decor3d.renderer.domElement.toDataURL(strMime);
            if (savefile) {
                this.saveFile(imgData.replace(strMime, strDownloadMime), "vinlagring.jpg");
            } else {
                return imgData;
            }
            this.decor3d.renderer.preserveDrawingBuffer = false;

        } catch (e) {
            console.log(e);
            this.decor3d.renderer.preserveDrawingBuffer = false;
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

    assignMaterial(key, matid, ext) {
        this.decorManager.assignMaterial(key, matid, ext);
    }


    setSliderValue(slider, value) {
        let s = document.getElementById(slider);
        s.value = value;
        this.setProperty(slider, value);
    }
    stopSelector() {
        this.decorRoomPlanner.stopSelectMoveTool();
    }
    returnTo3Dmode() {
        //after editing room in 2D
        this.decor3d.addPerspectiveCamera();        
        this.decorManager.setCamera();

        if(this.focusRoom != null){
            DecorUI.createUI(this.focusRoom,true);
            this.focusRoom.showhide2D(false);
        }

        DecorUI.weedUnavailable();
        this.decorManager.enable();
        this.decorRoomPlanner.startSelectMoveTool();
        $("#buttonmenu").css("display", "block");
        $("#dialogboxholder").css("display", "block");
        this.decor3d.controls.enabled = true;
        this.cadMode = false;

        this.decorRoomPlanner.scaleTexts(6);
        
        while (this.decor3d.controlLayer.children.length > 0) {
            this.decor3d.controlLayer.remove(this.decor3d.controlLayer.children[this.decor3d.controlLayer.children.length - 1]);
        }
        while (this.decor3d.drawLayer.children.length > 0) {
            this.decor3d.drawLayer.remove(this.decor3d.drawLayer.children[this.decor3d.drawLayer.children.length - 1]);
        }
        $("#dimensions").html("");
        this.decorRoomPlanner.endEdit();
        render();

    }
    uploadFile() {
        this.uploader.openFromHD();
    }
    closeUpload() {
        this.uploader.close();
    }
    importFile(input) {
        this.uploader.readURL(input);
    }
    addImportedFile(model) {
        this.decorManager.addUserModel(model);
    }
    //Make a wall picture from an image uploaded by the user
    createPicture(data) {
        let params = {
            snap: "wall",
            snap_type: "",
            model_class: "DecorPicture",
            model: "black_frame.glb",
            sku: "none",
            id: "000",
            metadata: data
        };
        this.decorManager.addDecorObject(params);
    }
    downloadDVS() {
        console.log("download design file");
        this.decorIO.saveDesign(this.decor3d.decorLayer, this.decor3d.envLayer, true);


        var a = document.createElement("a");
        var file = new Blob([this.currentDesign], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = 'mydesign.dvs';
        a.click();

    }
    downloadModel() {
        var exporter = new DecorGLTFExporter();
        var target = this.decor3d.decorLayer;
        this.decor3d.showHideGrid(false);

        render();
        var filename = 'model';

        let scope = this;

        if (target != null) {
            exporter.parse(target, function (result) {

                scope.saveArrayBuffer(result, filename + '.glb');
                // forceIndices: true, forcePowerOfTwoTextures: true
                // to allow compatibility with facebook
            }, { binary: true, forceIndices: false, forcePowerOfTwoTextures: true });
        }

        this.decor3d.showHideGrid(true);
        render();

    }
    saveArrayBuffer(buffer, filename) {

        this.saveGLBFile(new Blob([buffer], { type: 'application/octet-stream' }), filename);

    }
    saveGLBFile(blob, filename) {
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...
    }

    saveSnapshot() {
        this.decorIO.saveDesign(this.decor3d.decorLayer, this.decor3d.envLayer, true);
        var designStr = this.currentDesign;
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem("decor_design", designStr);
        } else {
            // Sorry! No Web Storage support..
        }
    }

    loadSnapshot() {
        if (this.startDesign) return;
        this.decorRoomPlanner.startSelectMoveTool();
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            var jsonDesign = localStorage.getItem('decor_design');
            if (jsonDesign != null) {
                this.decorIO.loadDesign(this.decor3d.decorLayer, this.decor3d.envLayer, { message: "hello", design: jsonDesign });
            }

        } else {
            // Sorry! No Web Storage support..
        }


        window.addEventListener('beforeunload', (event) => {
            saveSnapshot();
        });
    }

    autoLogin() {
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            var token = localStorage.getItem('decor_token');
            if (token && token.length > 1) {
                this.setToken(token);
            }

        } else {
            // Sorry! No Web Storage support..
        }
    }

    /*decorObjectLoaded(){
        this.decorIO.loadNext();
    }*/

    resetDuplicationCount(){
        this.duplicationCount = 1;
    }

    duplicateSelected(direction = 1) {
        if (!this.focusObj) return;

        let len = this.decorRoomPlanner.multiSelected.length;

        if (len > 0) {
            this.hideHighlight();
            this.refreshMenu = false;
            let i = 0;
            for (i = 0; i < len; i++) {
                this.focusObj = this.decorRoomPlanner.multiSelected[i];
                let id = this.focusObj.decorId;
                console.log(this.focusObj.position, this.focusObj.matrix.elements);
                let mat = this.focusObj.matrix.clone();
                let ang = this.focusObj.getTrueRotation();
                //let ang = this.focusObj.rotation.y;
                console.log("ANGLE", ang);
                let xoff = this.focusObj.size.x * Math.cos(ang) * this.duplicationCount * direction;
                let zoff = this.focusObj.size.x * Math.sin(ang) * this.duplicationCount * direction;
                console.log("ANGLE", ang, xoff, zoff);
                mat.elements[12] += xoff;
                mat.elements[14] -= zoff;
                /*let copy = JSON.parse(JSON.stringify(this.decorRoomPlanner.multiSelected[i]));
                console.log(copy);
                this.decor3d.decorLayer.add(copy);*/
                this.loadModel(id, ltvs__lang, false, mat);
            }
            this.duplicationCount++;

            return;

        }

        this.hideHighlight();
        let id = this.focusObj.decorId;
        console.log(this.focusObj.position, this.focusObj.matrix.elements);
        let mat = this.focusObj.matrix.clone();
        let ang = this.focusObj.getTrueRotation();
        //let ang = this.focusObj.rotation.y;
        console.log("ANGLE", ang);
        let xoff = this.focusObj.size.x * Math.cos(ang) * direction;
        let zoff = this.focusObj.size.x * Math.sin(ang) * direction;
        console.log("ANGLE", ang, xoff, zoff);
        mat.elements[12] += xoff;
        mat.elements[14] -= zoff;
        this.loadModel(id, ltvs__lang, false, mat);


    }

    checkKey(e) {
        console.log("checking key", e.keyCode);
        switch (e.keyCode) {
            case 46:  //delete key
                this.deleteSelected();
                break;
            case 68:  // D key
                if (e.shiftKey) this.duplicateSelected();
                break;
            case 83:  // S key
                if (e.shiftKey) this.duplicateSelected(-1);
                break;
            case 33: //page up
                this.showWallView(1);
                break;
            case 34:  // page down
                this.showWallView(-1);
                break;
            default:
                break;

        }
        if (e.shiftKey) this.shiftkey = true;
    }
    checkUpKey(e) {
        this.shiftkey = false;

    }
    showWallView(index) {
        if (this.decor3d.envLayer.children < 1) return;
        let room = this.decor3d.envLayer.children[0];
        if (!room.wallArray) return;
        this.currentViewIndex += index;
        if (this.currentViewIndex > room.wallArray.length - 1) this.currentViewIndex = 0;
        if (this.currentViewIndex < 0) this.currentViewIndex = room.wallArray.length - 1;

        let wall = room.wallArray[this.currentViewIndex];
        var direction = new THREE.Vector3();
        wall.mesh.getWorldDirection(direction);

        // uncomment the following two lines to see the effect of the code

        this.decor3d.camera.position.copy(wall.mesh.position).add(direction.multiplyScalar(wall.wallLength * 1.5));
        this.decor3d.camera.position.y = wall.wallH;
        this.decor3d.controls.target.z = wall.mesh.position.z;
        this.decor3d.controls.target.x = wall.mesh.position.x;
        this.decor3d.controls.target.y = wall.wallH / 2;
        console.log(wall);
        this.decor3d.controls.update();
        this.currentFocusWall = wall;
        this.renderScene();


    }


    removeElement(id) {
        $('#' + id).remove();
    }
    //import price data
    importPrices() {
        let scope = this;
        $.ajax({
            type: "GET",
            url: "/csv/prices.csv",
            dataType: "text",
            success: function (data) { scope.processData(data); }
        });
    }

    processData(allText) {
        var record_num = 10;  // or however many elements there are in each row
        var allTextLines = allText.split(/\r\n|\n/);
        console.log(allTextLines[0]);
        var entries = allTextLines[0].split(';');
        console.log(entries);

        let obj = null;
        let line = null;
        let sku = null;
        for (var i = 1; i < allTextLines.length; i++) {
            line = allTextLines[i].split(';');
            obj = { price: line[5], description: line[0], link: line[3] };
            sku = String(line[1]).trim();
            this.products[sku] = obj;
        }
    }

    printOut(sharelink) {
        let imgData = this.saveAsImage(false);
        
        console.log(imgData,sharelink);
        var printWindow = window.open('', 'PRINT');
        printWindow.document.write('<html><head><title>Print Preview</title>');
        printWindow.document.write('<link rel="stylesheet" href="' + this.server_path + '/css/default/pro.css" type="text/css" />');
        printWindow.document.write('<body>');
        printWindow.document.write('<div style="width: 200px;padding: 10px;margin: 20px;"><img id="logo_id" style="width:200px" src="' + this.server_path + '/imgs/vinlagring.svg" draggable="false"></img></div>');
        printWindow.document.write('<div style="margin:20px; width:800px"><img style="width:800px;" id="imgtopWall" src="' + imgData + '"/></div>');

        
        
        printWindow.document.write("<div class='pagebreak'></div>");
        let botCount = this.bottleCount();


        printWindow.document.write('<div style="margin:20px; width:100px;border: 1px solid #ddd;padding: 10px;">');
        printWindow.document.write(botCount);
        printWindow.document.write('</div>');

        

        let productList = DecorUI.listDesign(this.decor3d.decorLayer, true);
        printWindow.document.write('<div style="margin:20px; width:800px">');
        printWindow.document.write(productList);
        printWindow.document.write('</div>');

        printWindow.document.write('<div style="margin:20px; width:800px">');
        printWindow.document.write('<a href=' + sharelink +'>' + sharelink + '</a>');
        printWindow.document.write('</div>');

        printWindow.document.write('</body></html>');
        setTimeout(function () {
            printWindow.print();
            //  printWindow.close();
        }, 500);

    }

    /*
    
    function PrintElem(elem) {
        console.log("PPPPP PrintElem", elem);
        // var mywindow = window.open('', 'PRINT', 'height=400,width=720');
        var mywindow = window.open('', 'PRINT');
        var printLogoSrc;
       
        printLogoSrc = document.getElementById("logo_id").src;
        // mywindow.document.write('<img src="' + printLogoSrc +'">');
        mywindow.document.write('<img src="' + printLogoSrc + '">');
        mywindow.document.write('<html><head><title>' + document.title + '</title>');
        mywindow.document.write('<link rel="stylesheet" href="css/printlist3.css" type="text/css" />')
        // mywindow.document.write('<style>body { #itemlisttable th: #33a939; }</style>');
        //mywindow.document.write('</head><body onload=print() >');
        // mywindow.document.write('</head><body  >');
        // mywindow.document.write('<h1>' + document.title + '</h1>');
        mywindow.document.write(document.getElementById(elem).innerHTML);
        // Page break
        mywindow.document.write("<div class='page-break'></div>");
    
        // var rec = mywindow.document.getElementById('itemlistcontainer').getBoundingClientRect();
        var y_topimg = 290 + _listLenght * 17; //rec.top + rec.height * 0.75 ; // hvorfor gange 0.75?
        console.log("y_topimg", y_topimg, _listLenght);
        mywindow.document.write("<div style='position:relative;'>");
        mywindow.document.write("<div  id='imgtopview'><img class='imgPrint' src='" + imgDataTopview + "'/></div >");
        mywindow.document.write("<div  id='imgtopview'><img class='imgPrint' src='" + imgDataTopviewDim + "'/></div >");
        mywindow.document.write("</div >");
    
        // Page break
        mywindow.document.write("<div class='page-break'></div>");
    
        mywindow.document.write("<img class='imgPrint' id='imgtopWall' src='" + imgDataTopWall + "'/>");
        // Page break
        mywindow.document.write("<div class='page-break'></div>");
        mywindow.document.write("<img class='imgPrint' id='imgrightWall' src='" + imgDataRightWall + "'/>");
        // Page break
        mywindow.document.write("<div class='page-break'></div>");
        mywindow.document.write("<img class='imgPrint' id='imgbottomWall' src='" + imgDataBottomWall + "'/>");
        // Page break
        mywindow.document.write("<div class='page-break'></div>");
        mywindow.document.write("<img class='imgPrint' id='imgleftWall' src='" + imgDataLeftWall + "'/>");
    
        // mywindow.document.write('<h1>' + document.title + '</h1>');
        mywindow.document.write('</body></html>');
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10
        //setTimeout(mywindow.print(),10000);
        setTimeout(function () {
            mywindow.close();
        }, 1000);
        //mywindow.print();
        //mywindow.close();
        var css = '@page { size: landscape; }',
            head = mywindow.document.head || mywindow.document.getElementsByTagName('head')[0],
            style = mywindow.document.createElement('style');
    
        style.type = 'text/css';
        style.media = 'print';
    
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(mywindow.document.createTextNode(css));
        }
    
        head.appendChild(style);
        setTimeout(function () {
            mywindow.print();
            mywindow.close();
        }, 500);
        
    
    
        return true;
    } */
    openSettings(){
        let dialog = new DialogBox('settings', 'settings.html');
        setTimeout(this.showSettings.bind(this),200);
    }
    showSettings(){
        document.getElementById(this.units).checked = true; 
    }
    setUnits(unit){
        this.units = unit;
        let inches = MathEx.cmToFeet(100);
        console.log(inches);
        console.log(MathEx.feetToCm(inches.feet,inches.inches));
    }
    

}








export { DD2022 };




