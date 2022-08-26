class DialogBox {
    constructor(id, content = null, params = null) {

        this.content = content;
        this.myUI = null;
        this.payload = null;
        this.id = id;
        this.params = params;
        $('#' + this.id).remove();
        this.draw();



    }

    draw() {
        this.myUI = document.createElement("div");
        this.myUI.setAttribute("id", this.id);
        this.myUI.classList.add('ltvs-dialogbox');
        this.myUI.innerHTML = '<div class="pop-up-close" onmouseup="$(\'#' + this.id + '\').remove();"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></div>';
        this.payload = document.createElement("div");
        this.payload.classList.add('ltvs-dialogbox-payload');
        document.body.appendChild(this.myUI);
        this.myUI.appendChild(this.payload);
        // this.load_html(DD2022.server_path + '/html/' + this.content, this.myUI);
        if(this.content != null){
            $(this.payload).load(DD2022.server_path + '/html/' + this.content);
        }
        if (this.params) {
            /*for(var propt in this.params){
                console.log(propt + ': ' + this.params[propt]);
                this.myUI.style[propt] = + this.params[propt];
            }*/
            for (let prop of Object.keys(this.params)) {
                // this.myUI.style[prop.toString()] = this.params[prop.toString()];
                this.myUI.style.setProperty(prop.toString(), this.params[prop.toString()], "important");
            }

        } else {
            //centralize on page
            this.myUI.style.setProperty("left", "50%");
            this.myUI.style.setProperty("top", "50%");
            this.myUI.style.setProperty("transform", "translate(-50%, -50%)");
        }


    }
    load_html(path, target) {


        fetch(path)
            .then((response) => response.text())
            .then((html) => {
                target.innerHTML = html;
            })
            .catch((error) => {
                console.warn(error);
            });
    }
    setHTMLContents(str){
        this.payload.innerHTML = str;
    }




}
export default DialogBox