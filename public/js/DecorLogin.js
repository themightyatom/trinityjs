class DecorLogin {
    constructor(callback) {
        this.myUI = null;
        this.closebt = null;
        this.tokenField = null;
        this.callback = callback;
    }

    login() {
        console.log("logging in");
        if (!this.myUI) {
            this.myUI = document.createElement("div");
            this.myUI.setAttribute("id", "ltvs_login");
            this.myUI.classList.add('ltvs-fullscreen-dialogbox');
            document.body.appendChild(this.myUI);
            //this.myUI.innerHTML='<object style="width:100%;height:100%" type="text/html" data="/html/login.html" ></object>';
            $(this.myUI).load(DD2022.server_path + '/html/login.html',null,this.onloadedDoStuff);
            //add close button OVER ui
            this.closebt = document.createElement('div');
            this.closebt.classList.add('back-but');
            this.closebt.innerHTML = "<img style='box-shadow:none;'  class='no-drop' width='24px' height='24px' src='" + ltvs__source +"/icons/arrow_back_black_24dp.svg'>";
            document.body.appendChild(this.closebt);
            this.closebt.addEventListener("click", () => this.closeLogin());
            //this.closebt.addEventListener('onpointerup',this.closeLogin());
            this.tokenField = document.createElement('input');
            this.tokenField.setAttribute("type", "hidden");
            document.body.appendChild(this.tokenField);
            this.tokenField.setAttribute("id", "ltvs__token");
            this.tokenField.setAttribute("value", "");
            this.tokenField.style.display = "none";
            this.tokenField.addEventListener('ltvs__loggedIn', e => this.loginSuccess(e));
        }
    }
    onloadedDoStuff(){
        console.log("doing stuff");
    }
    closeLogin(){
        console.log("close");
        if(this.myUI) {
            document.body.removeChild(this.myUI);
            document.body.removeChild(this.closebt);
            this.myUI = null;
            this.closebt = null;
        }
    }

    loginSuccess(token){
        
        this.closeLogin();
        this.callback(token.detail.text);
        // save token for next session
        if(token.detail.stay){
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.
                localStorage.setItem("decor_token", token.detail.text);
            } else {
                // Sorry! No Web Storage support..
            }
        }else{
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.
                localStorage.setItem("decor_token", "");
            } else {
                // Sorry! No Web Storage support..
            }
        }
    }
    loginChange(){
        console.log("token changed");
    }

   
  



}

export default DecorLogin;

