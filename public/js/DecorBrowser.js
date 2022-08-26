class DecorBrowser {
    constructor() {
        window.DecorBrowser = this;
        this.browser;
        this.categories;
        this.grid;
        this.materialArray = [];
        this.chooser;
    }
    createBrowser() {
        this.browser = document.createElement("div");
        this.browser.classList.add('item-browser');
        this.categories = document.createElement("div");
        this.categories.classList.add('category-list');
        this.grid = document.createElement("div");
        this.grid.classList.add("product-grid");
        ltvs_menuHolder.appendChild(this.browser);
        this.browser.appendChild(this.categories);
        this.browser.appendChild(this.grid);
    }
    loadProductMenu() {
        let lang = ltvs__lang;
        // ltvs_menuHolder.classList.add("cover-full");
        this.createBrowser();
        const itemBrowser = this;
        fetch(ltvs__source + '/clients/productmenu/' + lang)
            .then(response => response.json())
            .then(data => {
                let htmlStr = "<div><div class='cat-but' style='width:50px;float:left' onmousedown='DecorRoomPlanner.removeUI()'><img style='box-shadow:none;' width='24px' height='24px' src='" + ltvs__source + "/icons/arrow_back_black_24dp.svg'></div><div class='search-box-holder'><form><input onkeyup='DecorBrowser.search(event)'class='search-box' type='text' placeholder='search'></form></div></div>";
                data.cats.forEach(element => {
                    // htmlStr += "<div class='cat-con'><div class='pallet-item-container' onmousedown='DecorBrowser.openCat(" + element.id + ")'><img src='" + ltvs__source + "/thumbs/categories/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div></div>";
                    htmlStr += "<div class='cat-con' onmousedown='DecorBrowser.openCat(" + element.id + ")'><div class='pallet-item-container'><div class='cat-label'>" + element.title + "</div></div></div>";
                });

                itemBrowser.categories.innerHTML = htmlStr;
            });
        //get materials for later...
        fetch(ltvs__source + '/materials/all')
            .then(response => response.json())
            .then(data => {
                this.materialArray = data;
            });
    }
    openCat(id, redraw = false) {
        const itemBrowser = this;
        if (redraw) {
            this.createBrowser();
        }
        $(".material-picker").remove();
        //ltvs_menuHolder.classList.add("cover-full");
        fetch(ltvs__source + '/clients/category/' + id + '/none')
            .then(response => response.json())
            .then(data => {
                itemBrowser.grid.innerHTML = "";

                let htmlStr = "";
                const matPicks = new Set();
                let roombrowsing = false;
                data.models.forEach(element => {
                    //look for material options
                    if (element.materials.length > 0) {
                        let mats = JSON.parse(element.materials);
                        if (Array.isArray(mats)) {
                            mats.forEach(matPicks.add, matPicks);
                        } else if (mats.length > 0) {
                            matPicks.add(mats); // single value
                        }
                    }


                    if (element.snap_type == "environment") {
                        // htmlStr += "<div class='pallet-item-container' onmousedown= \"DecorRoomPlanner.loadEnvironment('" + element.model_class + "','" + element.id + "','"+ element.snap +"','"+ element.model +"','" + element.sku + "')\"><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id +".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                        htmlStr += "<div class='pallet-item-container' onmousedown='DecorRoomPlanner.loadEnvironment(" + element.id + ")'><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                        roombrowsing = true;
                    } else {
                        htmlStr += "<div class='pallet-item-container' data-mat='" + element.default_material + "' onmousedown='DecorRoomPlanner.loadNewModel(" + element.id + ")'><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                    }
                    // htmlStr += "<div class='model-but' style='background-image:url(\""+ ltvs__source + "/thumbs/models/" + element.id +".png\")' onmousedown='DecorRoomPlanner.loadNewModel(" + element.id +")'>" + element.title + "</div>";
                });
                itemBrowser.grid.innerHTML = htmlStr;

                if (matPicks.size > 0 && !roombrowsing) {
                    this.chooser = document.createElement("div");
                    this.chooser.classList.add("material-picker");
                    let [first] = matPicks;
                    this.showElements(first);


                    let chooserStr = "";
                    matPicks.forEach(matID => {
                        let mat = this.getMaterial(matID);
                        chooserStr += '<div class="material-button" onclick="DecorBrowser.showElements(' + matID + ')"><img src="' + ltvs__source + '/icons/' + mat.extension + '.png" width="100" height="30"><span class="color-change-label">' + mat.title + '</span></div>';
                    })
                    this.chooser.innerHTML = chooserStr;
                    itemBrowser.browser.insertBefore(this.chooser, itemBrowser.browser.firstChild);
                    itemBrowser.grid.style.top = "41px";
                } else {
                    itemBrowser.grid.style.top = "0px";
                    //this.chooser.innerHTML = "";
                }

            })
    }
    search(evt) {
        console.log(evt.target.value);
        if (evt.target.value.length > 1) {
            this.previewSearch(evt.target.value);
        }else{
            this.grid.innerHTML = ""; 
        }

    }
    previewSearch(str) {
        const itemBrowser = this;

        //ltvs_menuHolder.classList.add("cover-full");
        fetch(ltvs__source + '/models/search/' + str)
            .then(response => response.json())
            .then(data => {
                itemBrowser.grid.innerHTML = "";

                let htmlStr = "";

                data.models.forEach(element => {
                    if (element.menu == 1) {
                        if (element.snap_type == "environment") {
                            // htmlStr += "<div class='pallet-item-container' onmousedown= \"DecorRoomPlanner.loadEnvironment('" + element.model_class + "','" + element.id + "','"+ element.snap +"','"+ element.model +"','" + element.sku + "')\"><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id +".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                            htmlStr += "<div class='pallet-item-container' onmousedown='DecorRoomPlanner.loadEnvironment(" + element.id + ")'><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div>";

                        } else {
                            htmlStr += "<div class='pallet-item-container' data-mat='" + element.default_material + "' onmousedown='DecorRoomPlanner.loadNewModel(" + element.id + ")'><img width='80' height='80' src='" + ltvs__source + "/thumbs/models/" + element.id + ".png'><div class='itempalette-label'>" + element.title + "</div></div>";
                        }
                    }
                    // htmlStr += "<div class='model-but' style='background-image:url(\""+ ltvs__source + "/thumbs/models/" + element.id +".png\")' onmousedown='DecorRoomPlanner.loadNewModel(" + element.id +")'>" + element.title + "</div>";
                });
                itemBrowser.grid.innerHTML = htmlStr;


            })
    }
    showElements(matid) {
        let allElements = $('[data-mat]');
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].dataset.mat == matid) {
                allElements[i].style.display = "block";
            } else {
                allElements[i].style.display = "none";
            }
        }
    }
    getMaterial(matid) {
        let intValue = parseInt(matid);
        let material = {};
        this.materialArray.forEach(mat => {
            if (mat.id === intValue) {
                material = mat
            }
        })
        return material;
    }
}

export default DecorBrowser