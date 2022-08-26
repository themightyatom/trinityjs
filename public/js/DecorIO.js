

class DecorIO {
    constructor() {
        this.myUI = null;
        this.closebt = null;
        this.loadQueue = [];
        this.loadFunc = null;
    }
    saveDesign(decorLayer, envLayer,share = false) {
        console.log("LAYER", decorLayer);
        console.log("ENV", envLayer);

        let design = {version:'1.0', server: DD2022.server_path, language:DD2022.lang};
        //save the environment!

        let obj;
        let acc;
        let environment = {};
        let accessories = [];
        if (envLayer.children.length > 0) {

            obj = envLayer.children[0];
           /* environment.id = obj.decorId;
            environment.model_class = obj.type;
            environment.model = obj.model;
            environment.metadata = obj.getMetaData();
            environment.snap_type = 'environment';
            environment.sku = obj.sku;
            for (var ac = 0; ac < obj.accessoryLayer.children.length; ac++) {
                acc = obj.accessoryLayer.children[ac];
                accessories.push(this.serializeDecorObj(acc));
            }

            environment.added_accessories = accessories; */
            environment = this.serializeDecorObj(obj);
            design.environment = environment;
        }

        let decorGroups = [];

        let serialobj;

        for (var i = 0; i < decorLayer.children.length; i++) {
            serialobj = this.serializeDecorObj(decorLayer.children[i]);
            decorGroups.push(serialobj);
        }
        design.decorGroups = decorGroups;
        console.log(JSON.stringify(design));
        DD2022.currentDesign = JSON.stringify(design);

        if(share){
            return;
        }

        if (!this.myUI) {
            this.myUI = document.createElement("div");
            this.myUI.setAttribute("id", "ltvs_save");
            this.myUI.classList.add('ltvs-fullscreen-dialogbox');
            document.body.appendChild(this.myUI);
            //this.myUI.innerHTML='<object style="width:100%;height:100%" type="text/html" data="/html/login.html" ></object>';
            $(this.myUI).load(DD2022.server_path + '/html/save.html');
            //add close button OVER ui
            this.closebt = document.createElement('div');
            this.closebt.classList.add('login-close');
            this.closebt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
            document.body.appendChild(this.closebt);
            this.closebt.addEventListener("click", () => this.closeSave());
            //this.closebt.addEventListener('onpointerup',this.closeLogin());
        }

    }
    serializeDecorObj(obj) {
        if(obj.classtype == undefined) return; // ignore any three Objects 
        let decorObj = {};
        let acc;
        let accessories = [];
        decorObj.id = obj.decorId;
        decorObj.matrix = obj.matrix.elements;
        decorObj.name = String(obj.name);
        decorObj.sku = String(obj.sku);
        decorObj.model_class = String(obj.classtype);
        decorObj.model = String(obj.model);
        decorObj.default_material = obj.defaultMaterialID;
        decorObj.default_material_key = obj.defaultMaterialKey;
        decorObj.default_accessories = obj.default_accessories;
        decorObj.snap = obj.snap;
        decorObj.snap_type = obj.snap_type;
        decorObj.includeByDefault = obj.includeByDefault;
        decorObj.metadata = obj.getMetaData();
        decorObj.added_accessories = [];
        decorObj.loadOwnParameters = true;
        decorObj.flip = obj.flipX;
         decorObj.mirror = obj.signature.mirror;
        if (obj.myDragPlane) {
            decorObj.dragplane = { normal: obj.myDragPlane.normal, constant: obj.myDragPlane.constant };
        }
        for (var ac = 0; ac < obj.accessoryLayer.children.length; ac++) {
            acc = obj.accessoryLayer.children[ac];
            if(acc.classtype != undefined){
                decorObj.added_accessories.push(this.serializeDecorObj(acc));
            }
        }
        return decorObj;

    }
  
    loadDesign(decorLayer, envLayer, data) {
        this.loadQueue = [];
        console.log("DATA", data.message, data.design);
        let design = JSON.parse(data.design);
        DD2022.lang = design.language;
        DD2022.server_path = design.server;
        DD2022.setMenuRefresh(false);
        let time = 0;
        /*design.decorGroups.forEach(item => {
           setTimeout( function(){DD2022.decorManager.addDecorObject(item)}, time);
           time += 1000;
        })*/
        if (design.environment) {
            let env = design.environment;
            //DD2022.decorManager.addDecorObject(env);
            this.loadQueue.push(env);
        }
        design.decorGroups.forEach(item => {
            //DD2022.decorManager.addDecorObject(item);
            this.loadQueue.push(item);

         })
         this.loadFunc = setInterval(this.loadNext.bind(this),1);
       //this.loadNext();

         
       
    }

    loadNext(){
        if(this.loadQueue.length > 0){
            DD2022.decorManager.addDecorObject(this.loadQueue.shift());
        }else{
            clearInterval(this.loadFunc);
            //DD2022.setMenuRefresh(true);
            //return;
            console.log("finished loading");
        }
    }

    closeSave() {
        console.log("close");
        if (this.myUI) {
            document.body.removeChild(this.myUI);
            document.body.removeChild(this.closebt);
            this.myUI = null;
            this.closebt = null;
        }
    }

}

export default DecorIO;