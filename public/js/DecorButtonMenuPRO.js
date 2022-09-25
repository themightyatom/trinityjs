


class DecorButtonMenuPRO{

    constructor(decor3d,callback,decorManager){
        this.loggedin = false;
        this.iconColor = '#f0f0f0';
        this.buttonArray;
        this.buttonmenu = null;
        this.copyright_button = null;
        this.decor3d = decor3d;
        this.user_button;
        this.menuIsOpen =false;
        this.languages = ["en", "se"];
        this.decorManager = decorManager;
        
        this.callback = callback;
        this.drawUI();
    }

    drawUI(){

    //basic UI 
    if(this.buttonmenu == null){ //prevent redraw on language change
        this.buttonmenu = document.createElement("div");
        this.buttonmenu.setAttribute("id", "buttonmenu");
        this.buttonmenu.classList.add("buttonmenu"); 
    }

    this.buttonmenu.innerHTML = "";


    const more_but = document.createElement("div");
    more_but.classList.add("more-but");
    more_but.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/></svg></div>";
    document.body.appendChild(this.buttonmenu);
    this.buttonmenu.appendChild(more_but);
    more_but.onmousedown = this.togglebuttonmenu.bind(this);

    this.buttonArray = document.createElement("div");
    this.buttonArray.setAttribute("id", "button-array");
    this.buttonArray.classList.add("buttonarray");
    this.buttonmenu.appendChild(this.buttonArray);



    const ar_button = document.createElement("div");
    ar_button.setAttribute("id", "arButton");
    ar_button.classList.add("buttonArrayButton");
    ar_button.setAttribute("title", this.getTranslation('ar'));
    //ar_button.onmousedown = this.callback('ar').bind(this);
    //if(!this.iOS()){
        ar_button.addEventListener('mousedown', e => this.callback('ar'));
    //}else{
      //  ar_button.addEventListener('mousedown', e => this.callback('arios')); 
    //}
    
    ar_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M18.25 7.6l-5.5-3.18c-.46-.27-1.04-.27-1.5 0L5.75 7.6c-.46.27-.75.76-.75 1.3v6.35c0 .54.29 1.03.75 1.3l5.5 3.18c.46.27 1.04.27 1.5 0l5.5-3.18c.46-.27.75-.76.75-1.3V8.9c0-.54-.29-1.03-.75-1.3zM7 14.96v-4.62l4 2.32v4.61l-4-2.31zm5-4.03L8 8.61l4-2.31 4 2.31-4 2.32zm1 6.34v-4.61l4-2.32v4.62l-4 2.31zM7 2H3.5C2.67 2 2 2.67 2 3.5V7h2V4h3V2zm10 0h3.5c.83 0 1.5.67 1.5 1.5V7h-2V4h-3V2zM7 22H3.5c-.83 0-1.5-.67-1.5-1.5V17h2v3h3v2zm10 0h3.5c.83 0 1.5-.67 1.5-1.5V17h-2v3h-3v2z'/></svg></div><div class='menu-lable'><span>" + this.getTranslation('ar') + "<span></div>";
    
    const picture_button = document.createElement("div");
    picture_button.setAttribute("id", "picButton");
    picture_button.setAttribute("title", this.getTranslation('save_snap'));
    picture_button.classList.add("buttonArrayButton");
    picture_button.addEventListener('mousedown', e => this.callback('img'));
    picture_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0V0z' fill='none'/><path d='M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z'/></svg></div><div class='menu-lable'><span>" + this.getTranslation('save_snap') + "<span><div>";
    
    const browse_button = document.createElement("div");
    browse_button.setAttribute("id", "browseButton");
    browse_button.setAttribute("title", this.getTranslation('add_object'));
    browse_button.classList.add("buttonArrayButton");
    browse_button.addEventListener('mousedown', e => this.callback('browse'));
    browse_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0V0z' fill='none'/><path d='M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/></svg></div><div class='menu-lable'><span>" + this.getTranslation('add_object') + "<span></div>";

    const logo_button = document.createElement("div");
    logo_button.setAttribute("id", "logoButton");
    logo_button.setAttribute("title", "Vinlagring.se");
    logo_button.classList.add("buttonArrayButton");
    logo_button.addEventListener('mousedown', e => this.callback('toggle_titles'));
    logo_button.innerHTML = "<img src='" + ltvs__source + "/imgs/logo_small.png' width='35' height='35'>";
    

    const room_edit_button = document.createElement("div");
    room_edit_button.setAttribute("id", "roomButton");
    room_edit_button.setAttribute("title", this.getTranslation('edit_room'));
    room_edit_button.classList.add("buttonArrayButton");
   // room_edit_button.innerHTML = "<div class='decor-icon'><svg  x= '0px ' y= '0px ' width= '24px ' height= '24px ' viewBox= '0 0 24 24 '><path id= 'Layer0_0_1_STROKES ' stroke= '" + this.iconColor + "' stroke-width= '2 ' stroke-linejoin= 'square' stroke-linecap= 'square' fill= 'none' d= 'M 14.15 2.75 L 2.55 2.75 2.55 21.5 13.65 21.5 13.65 16.15 21.4 16.15 21.4 2.75 19.9 2.75 16.2 7.4'/></svg></div>";
   room_edit_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24' stroke= '" + this.iconColor + "'><path d='M 21.0413,11.14C 21.1827,11.14 21.3173,11.1973 21.4213,11.3027L 22.6973,12.5787C 22.912,12.792 22.912,13.14 22.6973,13.3493L 21.6973,14.3493L 19.6507,12.3027L 20.6507,11.3027C 20.76,11.1973 20.9013,11.14 21.0413,11.14 Z M 19.0627,12.88L 21.1093,14.932L 15.0627,21L 13,21L 13,18.9373L 19.0627,12.88 Z M 12,5.688L 7,10.188L 7,18L 11,18L 11,20L 5,20L 5,12L 2,12L 12,3L 19.4587,9.71285L 17,12.1716L 17,10.188L 12,5.688 Z' /></svg></div><div class='menu-lable'><span>" + this.getTranslation('edit_room') + "<span></div>";
     room_edit_button.addEventListener('mousedown', e => this.callback('room'));
   
    const share_button = document.createElement("div");
    share_button.setAttribute("id", "shareButton");
    share_button.setAttribute("title", this.getTranslation('share') );
    share_button.classList.add("buttonArrayButton");
    share_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/></svg></div><div class='menu-lable'><span>" + this.getTranslation('share') + "<span></div>";
    share_button.addEventListener('mousedown', e => this.callback('share'));

    const save_button = document.createElement("div");
    save_button.setAttribute("id", "saveButton");
    save_button.setAttribute("title", this.getTranslation('save_load_design'))
    save_button.classList.add("buttonArrayButton");
    save_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z'/></svg></div><div class='menu-lable'><span>" + this.getTranslation('save_load_design') + "<span></div>";
    save_button.addEventListener('mousedown', e => this.callback('save'));

    const list_button = document.createElement("div");
    list_button.setAttribute("id", "listButton");
    list_button.setAttribute("title", this.getTranslation("list"));
    list_button.classList.add("buttonArrayButton");
    list_button.innerHTML = '<div class="decor-icon"><svg class="svg-icon" height="24px" viewBox="0 0 24 24" width="24px" fill="' + this.iconColor +'"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg></div><div class="menu-lable"><span>' + this.getTranslation("list") + '<span></div>';
    list_button.addEventListener('mousedown', e => this.callback('list'));


    const upload_button = document.createElement("div");
    upload_button.setAttribute("id", "uploadButton");
    upload_button.setAttribute("title", this.getTranslation('upload'));
    upload_button.classList.add("buttonArrayButton");
    upload_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor +"'><path d='M0 0h24v24H0z' fill='none'/><path d='M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z'/></svg></div><div class='menu-lable'><span>" + this.getTranslation('upload') + "<span></div>";
    upload_button.addEventListener('mousedown', e => this.callback('upload'));

    const duplicate_button = document.createElement("div");
    duplicate_button.setAttribute("id", "duplicateButton");
    duplicate_button.setAttribute("title", this.getTranslation('duplicate'));
    duplicate_button.classList.add("buttonArrayButton");
    duplicate_button.innerHTML = " <div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z' /></svg></div><div class='menu-lable'><span>" + this.getTranslation('duplicate') + "<span></div>";
    duplicate_button.addEventListener('mousedown', e => this.callback('duplicate'));
   

    const download_button = document.createElement("div");
    download_button.setAttribute("id", "downloadButton");
    download_button.setAttribute("title", this.getTranslation('download'));
    download_button.classList.add("buttonArrayButton");
    download_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 24 24' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><g><rect fill='none' height='24' width='24'/></g><g><path d='M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z'/></g></svg></div><div class='menu-lable'><span>" + this.getTranslation('download') + "<span></div>";
    download_button.addEventListener('mousedown', e => this.callback('download'));

    const cad_button = document.createElement("div");
    cad_button.setAttribute("id", "cadButton");
    cad_button.classList.add("buttonArrayButton");
    cad_button.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24' fill='" + this.iconColor + "'><path d='M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z' /></svg><div class='menu-lable'><span>" + this.getTranslation('cad') + "<span></div>";
   // cad_button.innerHTML ='<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="' + this.iconColor + '"><path d="M11 18H13V15H16V13H13V10H11V13H8V15H11ZM18 22H6Q5.175 22 4.588 21.413Q4 20.825 4 20V4Q4 3.175 4.588 2.587Q5.175 2 6 2H14L20 8V20Q20 20.825 19.413 21.413Q18.825 22 18 22ZM13 9V4H6Q6 4 6 4Q6 4 6 4V20Q6 20 6 20Q6 20 6 20H18Q18 20 18 20Q18 20 18 20V9ZM6 4V9V4V9V20Q6 20 6 20Q6 20 6 20Q6 20 6 20Q6 20 6 20V4Q6 4 6 4Q6 4 6 4Z"/></svg> <div class="menu-lable"><span>' + this.getTranslation("cad") + '<span></div>';
    cad_button.addEventListener('mousedown', e => this.callback('cad'));
    
    
    this.user_button = document.createElement("div");
    this.user_button.setAttribute("id", "userButton");
    this.user_button.classList.add("buttonArrayButton");
    this.showloggedon(this.loggedin);
    this.user_button.addEventListener('mousedown', e => this.callback('user'));

    const move_button = document.createElement("div");
    move_button.setAttribute("id", "moveButton");
    move_button.classList.add("buttonArrayButton");
    move_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24' fill='" + this.iconColor + "'><path d='M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z' /></svg></div>";
    move_button.addEventListener('mousedown', e => this.callback('img'));


    const new_button = document.createElement("div");
    new_button.setAttribute("id", "newButton");
    new_button.setAttribute("title", this.getTranslation("new") );
    new_button.classList.add("buttonArrayButton");
    new_button.innerHTML ='<div class="decor-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="' + this.iconColor + '"><path d="M11 18H13V15H16V13H13V10H11V13H8V15H11ZM18 22H6Q5.175 22 4.588 21.413Q4 20.825 4 20V4Q4 3.175 4.588 2.587Q5.175 2 6 2H14L20 8V20Q20 20.825 19.413 21.413Q18.825 22 18 22ZM13 9V4H6Q6 4 6 4Q6 4 6 4V20Q6 20 6 20Q6 20 6 20H18Q18 20 18 20Q18 20 18 20V9ZM6 4V9V4V9V20Q6 20 6 20Q6 20 6 20Q6 20 6 20Q6 20 6 20V4Q6 4 6 4Q6 4 6 4Z"/></svg></div> <div class="menu-lable"><span>' + this.getTranslation("new") + '<span></div>';
    new_button.addEventListener('mousedown', e => this.callback('new'));

    const lang_button = document.createElement("div");
    lang_button.setAttribute("id", "langButton");
    lang_button.setAttribute("title", this.getTranslation("language") );
    lang_button.style.maxHeight = "19px";
    lang_button.classList.add("buttonArrayButton");
    lang_button.classList.add("right-aligned");
    lang_button.innerHTML ='<div class="decor-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' + this.iconColor + '"><path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg></div>';
    lang_button.onmouseup = this.showlanguages.bind(this);

    for(var i=0;i<this.languages.length;i++){
        let node = document.createElement("div");
        node.classList.add('language-selector');
        lang_button.appendChild(node);
        node.innerHTML = this.languages[i];
        node.onmousedown = this.changeLanguage.bind(this);
    }



    // button order
   
    this.buttonArray.appendChild(logo_button);
    this.buttonArray.appendChild(browse_button);
    this.buttonArray.appendChild(new_button);
    this.buttonArray.appendChild(room_edit_button);
    this.buttonArray.appendChild(cad_button);
    this.buttonArray.appendChild(save_button);
    this.buttonArray.appendChild(upload_button);
    this.buttonArray.appendChild(duplicate_button);
   // this.buttonArray.appendChild(download_button);
   // buttonArray.appendChild(move_button);
   
    
   if (!this.iOS()) {
        this.buttonArray.appendChild(picture_button);
    }

    this.buttonArray.appendChild(share_button);

    this.buttonArray.appendChild(ar_button);
   
   
   this.buttonArray.appendChild(list_button);
   this.buttonArray.appendChild(this.user_button);
   this.buttonArray.appendChild(lang_button);

   if(this.copyright_button == null){
   this.copyright_button = document.createElement("div");
   this.copyright_button.setAttribute("id", "copyright");
   this.copyright_button.setAttribute("title", "Visit devine.pub");
   this.copyright_button.classList.add("copyright-text");
   this.copyright_button.innerHTML ='<a href="https://devine.pub" target="_blank">Copyright&copy;2022 Devine Publishing </a>'; 
   document.body.appendChild(this.copyright_button);
   }
     
   
   
   
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
        this.user_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#297aae'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg></div>" + label;
        this.user_button.setAttribute("title", this.getTranslation('login') );
    }else{
        this.user_button.innerHTML = "<div class='decor-icon'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='" + this.iconColor + "'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z'/></svg></div>" + label;
        this.user_button.setAttribute("title", this.getTranslation('login') );
        }
    }

    getTranslation(obj){
       
        let lang = ltvs__lang;
        
        if(lang == "none" || lang == undefined){
            lang = 'en';
        }
        return Translations[lang][obj];
    }
    
    showlanguages(){
        $("#langButton").css('max-height', 300);
    }

    changeLanguage(e){
        console.log(e.target.innerHTML);
        ltvs__lang = e.target.innerHTML;
        this.buttonArray.innerHTML = "";
        this.callback('language');
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



export default DecorButtonMenuPRO;

