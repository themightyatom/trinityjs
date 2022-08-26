

class DecorButtonMenu{

    constructor(decor3d,callback,decorManager){
        this.loggedin = false;
        this.iconColor = '#696969';
        this.buttonArray;
        this.decor3d = decor3d;
        this.user_button;
        this.menuIsOpen =false;

        this.decorManager = decorManager;
        
        this.callback = callback;
        this.translations ={
            da:{
                add_object:"Tilføj møbler",
                save_snap:"Gem skærmbillede",
                share:"Del",
                edit_room:"Tilføj/rediger værelse",
                save_design:"Åben/gem design",
                list:"Tilføjede varer",
                login:"Login",
                ar:"Se i rummet"
            },   
            en:{
                add_object:"Add furniture",
                save_snap:"Save snapshot",
                share:"Share",
                edit_room:"Add/Edit room",
                save_design:"Open/save design",
                list:"Added products",
                login:"Login",
                ar:"See in your room"
            },
            nl:{
                add_object:"Add furniture",
                save_snap:"Save snapshot",
                share:"Share",
                edit_room:"Add/Edit room",
                save_design:"Open/save design",
                list:"Added products",
                login:"Login",
                ar:"See in your room"
            },
            it:{
                add_object:"Add furniture",
                save_snap:"Save snapshot",
                share:"Share",
                edit_room:"Add/Edit room",
                save_design:"Open/save design",
                list:"Added products",
                login:"Login",
                ar:"See in your room"
            },
            fr:{
                add_object:"Add furniture",
                save_snap:"Save snapshot",
                share:"Share",
                edit_room:"Add/Edit room",
                save_design:"Open/save design",
                list:"Added products",
                login:"Login",
                ar:"See in your room"
            },
            de:{
                add_object:"Möbel hinzufügen",
                save_snap:"Bildschirmfoto speichern",
                share:"Teilen",
                edit_room:"Zimmer hinzufügen/ändern",
                save_design:"Open/save design",
                list:"Hinzugefügte produkte",
                login:"Login",
                ar:"See in your room"
            },
        };
        this.drawUI();
    }

    drawUI(){

    //basic UI 
    const buttonmenu = document.createElement("div");
    buttonmenu.setAttribute("id", "buttonmenu");
    buttonmenu.classList.add("buttonmenu");
    const more_but = document.createElement("div");
    more_but.classList.add("more-but");
    more_but.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/></svg>";
    document.body.appendChild(buttonmenu);
    buttonmenu.appendChild(more_but);
    more_but.onmousedown = this.togglebuttonmenu.bind(this);

    this.buttonArray = document.createElement("div");
    this.buttonArray.setAttribute("id", "button-array");
    this.buttonArray.classList.add("buttonarray");
    buttonmenu.appendChild(this.buttonArray);

    const ar_button = document.createElement("div");
    ar_button.setAttribute("id", "arButton");
    ar_button.classList.add("buttonArrayButton");
    //ar_button.onmousedown = this.callback('ar').bind(this);
   // if(!this.iOS()){
        ar_button.addEventListener('mousedown', e => this.callback('ar'));
   // }else{
    //    ar_button.addEventListener('click', e => this.decorManager.exportAR()); 
    //}
    
    ar_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><title>View in your room</title><path d='M0 0h24v24H0z' fill='none'/><path d='M18.25 7.6l-5.5-3.18c-.46-.27-1.04-.27-1.5 0L5.75 7.6c-.46.27-.75.76-.75 1.3v6.35c0 .54.29 1.03.75 1.3l5.5 3.18c.46.27 1.04.27 1.5 0l5.5-3.18c.46-.27.75-.76.75-1.3V8.9c0-.54-.29-1.03-.75-1.3zM7 14.96v-4.62l4 2.32v4.61l-4-2.31zm5-4.03L8 8.61l4-2.31 4 2.31-4 2.32zm1 6.34v-4.61l4-2.32v4.62l-4 2.31zM7 2H3.5C2.67 2 2 2.67 2 3.5V7h2V4h3V2zm10 0h3.5c.83 0 1.5.67 1.5 1.5V7h-2V4h-3V2zM7 22H3.5c-.83 0-1.5-.67-1.5-1.5V17h2v3h3v2zm10 0h3.5c.83 0 1.5-.67 1.5-1.5V17h-2v3h-3v2z'/></svg><div class='menu-lable'><span>" + this.getTranslation('ar') + "<span></div>";
    
    const picture_button = document.createElement("div");
    picture_button.setAttribute("id", "picButton");
    picture_button.classList.add("buttonArrayButton");
    picture_button.addEventListener('mousedown', e => this.callback('img'));
    picture_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0V0z' fill='none'/><path d='M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z'/></svg><div class='menu-lable'><span>" + this.getTranslation('save_snap') + "<span><div>";
    
    const rp_button = document.createElement("div");
    rp_button.setAttribute("id", "rpButton");
    rp_button.classList.add("buttonArrayButton");
    rp_button.addEventListener('mousedown', e => this.callback('rp'));
    
    rp_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0V0z' fill='none'/><path d='M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/></svg><div class='menu-lable'><span>" + this.getTranslation('add_object') + "<span></div>";

    const room_edit_button = document.createElement("div");
    room_edit_button.setAttribute("id", "roomButton");
    room_edit_button.classList.add("buttonArrayButton");
   // room_edit_button.innerHTML = "<svg  x= '0px ' y= '0px ' width= '24px ' height= '24px ' viewBox= '0 0 24 24 '><path id= 'Layer0_0_1_STROKES ' stroke= '" + this.iconColor + "' stroke-width= '2 ' stroke-linejoin= 'square' stroke-linecap= 'square' fill= 'none' d= 'M 14.15 2.75 L 2.55 2.75 2.55 21.5 13.65 21.5 13.65 16.15 21.4 16.15 21.4 2.75 19.9 2.75 16.2 7.4'/></svg>";
     room_edit_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24' fill='" + this.iconColor + "'><path d='M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z' /></svg><div class='menu-lable'><span>" + this.getTranslation('edit_room') + "<span></div>";
     room_edit_button.addEventListener('mousedown', e => this.callback('room'));
   
    const share_button = document.createElement("div");
    share_button.setAttribute("id", "shareButton");
    share_button.classList.add("buttonArrayButton");
    share_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/></svg><div class='menu-lable'><span>" + this.getTranslation('share') + "<span></div>";
    share_button.addEventListener('mousedown', e => this.callback('share'));

    const save_button = document.createElement("div");
    save_button.setAttribute("id", "saveButton");
    save_button.classList.add("buttonArrayButton");
    save_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z'/></svg><div class='menu-lable'><span>" + this.getTranslation('save_design') + "<span></div>";
    save_button.addEventListener('mousedown', e => this.callback('save'));

    const list_button = document.createElement("div");
    list_button.setAttribute("id", "listButton");
    list_button.classList.add("buttonArrayButton");
    list_button.innerHTML = '<svg class="svg-icon" height="24px" viewBox="0 0 24 24" width="24px" fill="' + this.iconColor +'"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg><div class="menu-lable"><span>' + this.getTranslation("list") + '<span></div>';
    list_button.addEventListener('mousedown', e => this.callback('list'));
    
    
    this.user_button = document.createElement("div");
    this.user_button.setAttribute("id", "userButton");
    this.user_button.classList.add("buttonArrayButton");
    this.showloggedon(false);
    this.user_button.addEventListener('mousedown', e => this.callback('user'));

    const move_button = document.createElement("div");
    move_button.setAttribute("id", "moveButton");
    move_button.classList.add("buttonArrayButton");
    move_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24' fill='" + this.iconColor + "'><path d='M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z' /></svg>";
    move_button.addEventListener('mousedown', e => this.callback('img'));



    // button order
    this.buttonArray.appendChild(rp_button);
    this.buttonArray.appendChild(room_edit_button);
   // buttonArray.appendChild(move_button);
   
    this.buttonArray.appendChild(ar_button);
   if (!this.iOS()) {
        this.buttonArray.appendChild(picture_button);
    }

    this.buttonArray.appendChild(share_button);
    
   
   //this.buttonArray.appendChild(save_button);
   this.buttonArray.appendChild(list_button);
   //this.buttonArray.appendChild(this.user_button);
        //hide initially on mobile
    if(this.getWidth() < 600) this.closemenu();
    }

    togglebuttonmenu(){
        
        if(!this.menuIsOpen){
            this.openMenu();
        }else{
            this.closemenu();
        }
    }
    openMenu(){
        this.menuIsOpen = true;
        this.buttonArray.style.visibility = "visible";
    }
    closemenu(){
        this.menuIsOpen =false;
        this.buttonArray.style.visibility = "hidden";
    }

    showAR(){
        
       // window.ltvs__createAR();
    }

    showloggedon(value){
        this.loggedin = value;
        let label =  "<div class='menu-lable'><span>" + this.getTranslation('login') + "</span></div>";
        if(value === true){
        this.user_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#297aae'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>" + label;
        }else{
        this.user_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z'/></svg>" + label;
        }
    }

    getTranslation(obj){
       
        let lang = ltvs__lang;
        
        if(lang == "none" || lang == undefined){
            lang = 'en';
        }
        return this.translations[lang][obj];
    }
    

 

    shareDesign(){
        if(!loggedin){
            roomPlannerLogin();
        }else{
            ltvs__saveDesign();
        }
    }
   saveDesign(){
        if(!this.loggedin){
            this.roomPlannerLogin();
        }else{
            this.ltvs__saveDesign();
        }
    }



    
    toggleLoggedIn(value){
           this.showloggedon(value)
    }
    getWidth() {
        return Math.max(
          document.body.scrollWidth,
          document.documentElement.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.offsetWidth,
          document.documentElement.clientWidth
        );
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
    

};



export default DecorButtonMenu;

