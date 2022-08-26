

    import DecorManager from '/js/DecorManager.js';
    import DecorUI from '/js/DecorUI.js';
    import DecorButtonMenu from '/js/DecorButtonMenu.js';
    import DecorRoomPlanner from '/js/DecorRoomPlanner.js';
    import Decor3D from '/js/Decor3D.js'; 
    import DecorLogin from '/js/DecorLogin.js';
    import DecorIO from '/js/DecorIO.js';
    import eventManager from '/js/EventManager.js';


   class DecorPreview{
    constructor(){
        this.lang;
        this.decor3D = new Decor3D('ltvs_container','');
        this.server_path = '';
        this.decorManager = new DecorManager(this.decor3D);
        this.decorButtonMenu = new DecorButtonMenu(this.decor3D,this.buttonCommands.bind(this));
        this.decorLogin = new DecorLogin(this.setToken.bind(this));
        this.decorRoomPlanner = new DecorRoomPlanner(this.decor3D, this.decorManager);
        this.decorIO = new DecorIO();
        this.token = '';
        this.currentDesign = '';
        this.nextFunction = null;
        this.eventManager = new eventManager(this.decor3D.renderer.domElement); 
        this.eventManager.addAction({type:"down", target:this.decor3D , func:"startAnimate"});
        this.eventManager.addAction({type:"up", target:this.decor3D , func:"stopAnimate" });
        this.eventManager.addAction({type:"wheel", target:this.decor3D , func:"forceRefresh" });
        this.eventManager.addAction({ type: "down", target: this.decor3D.controls, func: "onPointerDown" });
		this.eventManager.addAction({ type: "cancel", target: this.decor3D.controls, func: "onPointerCancel" });
		this.eventManager.addAction({ type: "wheel", target: this.decor3D.controls, func: "onMouseWheel" });
        window.render = this.renderScene.bind(this);

    }

    loadModel(id,lang,replace = true){
        this.lang = lang;
        let sku = '0'; //not used if model id available
        fetch(this.server_path + '/clients/getmodel/' + lang + '/' + sku + '/' + id)
            .then(response => response.json())
            .then(data => {
                data.params.defaultAccessories = data.defaultAccessories;
                console.log(data);
                data.params.materials = data.materials; 
                data.params.variants = data.variants;
                this.decorManager.addDecorObject(data.params, replace );
               // loadGroup('{{params.model}}', '{{params.default_material}}', '{{params.default_material_key}}', '{{params.sku}}', defaultAccs);

              // DecorUI.createUI(data.materials, data.accessories, data.params.default_material_key, data.variants )
              // repeatLoad = true;
            })
    }
    loadMenu(group){
        DecorUI.createUI(group.materials,[], group.default_material_key, group.variants);

    }

    loadGroup(model_class,id,model,default_material,default_material_key,sku , defaultAccs, replace = true){
        let params = {model_class,id,model,default_material,default_material_key,sku};
        params.defaultAccessories = defaultAccs;
        this.decorManager.addDecorObject(params, replace );
    }

    renderScene(){
        //console.log("Called from outside");
        this.decor3D.update();
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
                if(this.decor3D.envLayer.children[0] && this.decor3D.envLayer.children[0].isRoom){
                    this.decor3D.envLayer.children[0].createUI();
                }else{
                    
                    this.decorRoomPlanner.openCat(40);
                    //autostart edit?
                    this.decorRoomPlanner.startSelectMoveTool();
                }
            default:
                break;
        }
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
    let params = {model_class, id, snap, model, sku, snap_type, exclude, include, default_material, default_material_key,metadata};
       this.decorManager.addAccessory(params, isGroupMember);
    }

    createList(list,defaultAccessorySkus,choosenFinish, checkmenu){
        console.log("LISTING", list);
        DecorUI.createList(list,choosenFinish, checkmenu);
    };
    resetPartsList(){
        DecorUI.clearUI();
    }
    sendToExportScript(){
        DecorUI.sendToExportScript();
    }
    loadDesign(data){
        this.decorManager.masterReset();
        this.decorIO.closeSave();
        DecorUI.clearUI();
        this.decorIO.loadDesign(this.decor3D.decorLayer,this.decor3D.envLayer,data);
    }

    saveDesign(){
        this.decorIO.saveDesign(this.decor3D.decorLayer,this.decor3D.envLayer);
    }

    check(){
        console.log("checked");
    }

    grabScreenshot() {
        this.decor3D.update();
        return this.decor3D.renderer.domElement.toDataURL();
    }
    setFocusGroup(group){
        this.focusObj = group;
    }
    checkMode(){
        //check if there are more than one object in the scene
            return this.decor3D.decorLayer.children.length
        
    }
    assignMaterial(matid, key , ext){
        this.decorManager.assignMaterial(key,matid, ext);
    }
    bottleCount(){
        
    }


   }

   export {DecorPreview};
    
  


