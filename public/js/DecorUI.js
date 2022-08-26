




var DecorUI = (function () {

    //basic UI without data
    const dialogboxholder = document.createElement("div");
    dialogboxholder.setAttribute("id", "dialogboxholder");
    dialogboxholder.classList.add("dialogboxholder");
    document.body.appendChild(dialogboxholder);

    const itempalette = document.createElement("div");
    itempalette.setAttribute("id", "itempalette");
    itempalette.classList.add("itempalette");
    dialogboxholder.appendChild(itempalette);

    const ltvs_listHolder = document.createElement("div");
    ltvs_listHolder.setAttribute("id", "ltvs_listHolder");
    ltvs_listHolder.classList.add("ltvs-menu-holder");
    document.body.appendChild(ltvs_listHolder);

    /*  const panelToggle = document.createElement("button");
      panelToggle.setAttribute("id", "panel-toggle");
      panelToggle.classList.add("panel-toggle");
      panelToggle.setAttribute("onclick", "togglePanel()");
      itempalette.appendChild(panelToggle); */

    let dev__array;
    let materialExtension = '';
    let primesku = '';
    let shoppingList;
    let acc__array;
    let focusObj;
    let currentModel;
    let translations = {
        da: {
            remove_all: "Fjern alt",
            edit: "Rediger",
            mirror: "Spejlvend",
            normal: "Normal",
            mirrored: "Spejlvendt",
            add_to_cart: "Læg i indkøbskurv",


        },
        se: {
            remove_all: "Fjern alt",
            edit: "Rediger",
            mirror: "Spejlvend",
            normal: "Normal",
            mirrored: "Spejlvendt",
            add_to_cart: "Læg i indkøbskurv",
            number: "Antal",
            sku: "Artikelnummer",
            decription: "Produkt",
            price: "Pris",
            total: "Pris totalt",
            bredth: "Bredth",
            width: "Width",
            height: "Height"

        },
        en: {
            remove_all: "Remove All",
            edit: "Edit",
            mirror: "Mirror",
            normal: "Normal",
            mirrored: "Mirrored",
            add_to_cart: "Add to Cart"
        },
        nl: {
            remove_all: "Remove All",
            edit: "Edit",
            mirror: "Mirror",
            normal: "Normal",
            mirrored: "Mirrored",
            add_to_cart: "Add to Wishlist"
        },
        fr: {
            remove_all: "Remove All",
            edit: "Edit",
            mirror: "Mirror",
            normal: "Normal",
            mirrored: "Mirrored",
            add_to_cart: "Add to Wishlist"
        },
        it: {
            remove_all: "Remove All",
            edit: "Edit",
            mirror: "Mirror",
            normal: "Normal",
            mirrored: "Mirrored",
            add_to_cart: "Add to Wishlist"
        },
        de: {
            remove_all: "Remove All",
            edit: "Edit",
            mirror: "Mirror",
            normal: "Normal",
            mirrored: "Mirrored",
            add_to_cart: "Add to Wishlist"
        },
        none: {
            remove_all: "Remove All",
            edit: "Edit",
            mirror: "Mirror",
            normal: "Normal",
            mirrored: "Mirrored",
            add_to_cart: "Add to Cart",
            number: "Antal",
            sku: "Artikelnummer",
            description: "Produkt",
            price: "Pris",
            total: "Pris totalt",
            width: "Width",
            height: "Height",
            depth: "Depth"
        }
    };

    function closeOtherPanels(exempt) {
        var acc = document.getElementsByClassName("accordion-bt");
        var i;
        for (i = 0; i < acc.length; i++) {
            var but = acc[i];
            if (but != exempt) {
                but.classList.remove('active');
                var panel = but.nextElementSibling;
                panel.style.maxHeight = null;
                panel.style.display = "none";
            }
        }
        DD2022.hideHighlight();
    }
    function itemFactory(title, sku, id) {
        let htmlStr = '';
        htmlStr += '<img id="img_' + sku + '" width="80" height="80" src="' + ltvs__source + '/thumbs/models/' + id + '.png ">';
        htmlStr += '<div id="tit_' + sku + '" class="itempalette-label">' + sku + '</div>';
        return htmlStr;
    }

    function panelFactory(accgrp) {
        let htmlStr = '';
        htmlStr += '<button id="accgrp_' + accgrp.id + '" class="accordion-bt grp">' + accgrp.title + '</button> <div id="accpan_' + accgrp.id + '" class="panel">';
        if (accgrp.list) {
            accgrp.list.forEach(function (acc) {
                //are there any available snaps?
                htmlStr += '<div id="node_' + acc.sku + '" class="pallet-item-container" data-snap="' + acc.snap + '" data-exclude="' + acc.exclude + '"';
                htmlStr += 'onmousedown="DD2022.addAccessory(\'' + acc.model_class + '\',\'' + acc.id + '\',\'' + acc.snap + '\',\'' + acc.model + '\',\'' + acc.sku + '\',\'' + acc.snap_type + '\',\'' + acc.exclude + '\',\'' + acc.include + '\',\'' + acc.default_material + '\',\'' + acc.default_material_key + '\')">';
                htmlStr += itemFactory(acc.title, acc.sku, acc.id);
                htmlStr += '</div>';

            });
        }
        htmlStr += '</div>';
        return htmlStr
    }

    function checkPrimeSku() {
        /* if (primesku.substr(0, 4) == "room") return;
         var base = primesku.split('-');
         if (base.length < 2) return;
         if (materialExtension.length > 0) base[1] = materialExtension;
         // catch special case, 1 does not mean luxury
 
 
         if (base[0].substr(0, 5) == "49611") {
 
             if (deluxe == 'yes') {
                 base[0] = "496111";
             } else {
                 base[0] = "49611";
             }
 
         } else if (base[0].substr(0, 5) == "47611") {
 
             if (deluxe == 'yes') {
                 base[0] = "476111";
             } else {
                 base[0] = "47611";
             }
 
         } else if (base[0].substr(0, 5) == "48611") {
 
             if (deluxe == 'yes') {
                 base[0] = "486111";
             } else {
                 base[0] = "48611";
             }
 
         } else {
 
             if (deluxe == 'yes') {
                 if (base[0].charAt(base[0].length - 1) == '1') {
                     // return;
                 } else {
                     base[0] = base[0] + '1';
                 }
             }
             if (deluxe == 'no') {
                 if (base[0].charAt(base[0].length - 1) == '1') {
                     base[0] = base[0].substr(0, base[0].length - 1);
                 }
             }
         }
         if (document.getElementById("tit_" + primesku)) {
             document.getElementById("tit_" + primesku).innerHTML = base[0] + "-" + base[1];
             focusObj.sku = base[0] + "-" + base[1];
         }
         if (shoppingList.length > 0 && shoppingList[0].sku) shoppingList[0].sku = base[0] + "-" + base[1]; */

    }

    function getAllAccessories() {
        var xhr = new XMLHttpRequest();

        var data = new FormData();
        var idlist = [];
        for (var i = 0; i < shoppingList.length; i++) {
            idlist.push(shoppingList[i].id);
        }

        data.append("list", idlist);
        //Send the proper header information along with the request
        xhr.onload = function (e) {
            updateUI(e.target.response.result);
        };
        xhr.open('POST', ltvs__source + "/clients/accessories", true);
        //xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.responseType = 'json';
        xhr.send(data);
    }

    function updateUI(accessory_groups) {

        //check that all accessories are there
        let accbts = document.getElementsByClassName('accordion-bt grp');
        for (var i = accbts.length - 1; i > -1; i--) {
            let _id = accbts[i].id.substr(7);

            if (!accessory_groups.includes(_id)) {

                removeElement('accgrp_' + _id);
                removeElement('accpan_' + _id);
            }
        };
        accessory_groups.forEach(function (grp) {
            let tab = document.getElementById('accgrp_' + grp);
            if (!tab && grp != 10) { //10 is slatbase, do not add dynamically!

                addAccessoryGroup(grp);
            }
        });
    }

    function removeElement(id) {
        var elem = document.getElementById(id);
        return elem.parentNode.removeChild(elem);
    }

    function addAccessoryGroup(id) {

        fetch(ltvs__source + "/clients/accessory-group/" + ltvs__lang + "/" + id)
            .then(response => response.json())
            .then(data => {
                //check if element exists
                let existing = document.getElementById('accgrp_' + data.accessories[0].id);
                if (existing) {
                    // console.log("ALREADY THERE", existing);
                } else {
                    let htmlStr = panelFactory(data.accessories[0]);
                    let el = createElementFromHTML(htmlStr, 0);
                    let pan = createElementFromHTML(htmlStr, 2);
                    let beforeEl = document.getElementById("shop-list");
                    document.getElementById('itempalette').insertBefore(pan, beforeEl);
                    document.getElementById('itempalette').insertBefore(el, pan);
                    el.addEventListener("click", function () {
                        this.classList.toggle("active");
                        closeOtherPanels(this);
                        var panel = this.nextElementSibling;
                        panel.style.display = "block";
                        if (panel.style.maxHeight) {
                            panel.style.maxHeight = null;
                            panel.style.display = "none";
                        } else {
                            panel.style.maxHeight = panel.scrollHeight + "px";

                        }
                        DD2022.decorManager.clearPreview();
                    });
                }
            });
    }
    function createElementFromHTML(htmlString, index) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        return div.childNodes[index];
    }

    function uiElementFactory(prop) {
        let htmlStr = '';
        switch (prop.ui) {
            case 'slider':
                if (!prop.images) prop.images = ['blank.png', 'blank.png'];
                htmlStr += '<div class="ltvs-slider-div"><a href="javascript:DD2022.setSliderValue(\'' + prop.title + '\',' + prop.range[0] + ')"><img src="' + ltvs__source + '/icons/' + prop.images[0] + '" ></a>';
                htmlStr += '<input id="' + prop.title + '" class="ltvs-slider" type="range" oninput="DD2022.setProperty(\'' + prop.title + '\' ,this.value)" onchange="DD2022.setProperty(\'' + prop.title + '\' ,this.value)" min="' + prop.range[0] + '" max="' + prop.range[1] + '" value="' + prop.value + '" class="slider" id="myRange">';
                htmlStr += '<a href="javascript:DD2022.setSliderValue(\'' + prop.title + '\',' + prop.range[1] + ')"><img src="' + ltvs__source + '/icons/' + prop.images[1] + '" ></a></div>';
                break;
            case 'toggle':
                htmlStr += '<div onmousedown="DD2022.setProperty(\'' + prop.title + '\',' + prop.value + ')">';
                htmlStr += '<img width="30" height="30" src="' + ltvs__source + '/icons/' + prop.icon + '">';
                htmlStr += '</div>'
                break;
            case 'spinner':
                htmlStr += '<div class="property-holder"><div class="property-icon"><img src="' + ltvs__source + '/icons/' + prop.icon + '" width="30" height="30"></div>';
                htmlStr += '<input class="property-spinner" type="number" oninput="DD2022.setProperty(\'' + prop.title + '\' ,this.value)" onchange="DD2022.setProperty(\'' + prop.title + '\' ,this.value)" min="' + prop.range[0] + '" max="' + prop.range[1] + '" value="' + prop.value + '" class="slider" id="ltvs__' + prop.title + '">';
                htmlStr += '</div>';
                break;
            case 'colorpicker':
                htmlStr += '<div class="property-holder"><div class="property-icon"><img src="' + ltvs__source + '/icons/' + prop.icon + '" width="30" height="30"></div>';
                htmlStr += '<input type="color" oninput="DD2022.setProperty(\'' + prop.title + '\' ,this.value)" onchange="DD2022.setProperty(\'' + prop.title + '\' ,this.value)"  value="' + prop.value + '" class="slider" id="myRange">';
                htmlStr += '</div>';
                break;
            case 'imagepicker':
                htmlStr += '<div class="property-holder"><div class="property-icon"><img src="' + ltvs__source + '/icons/' + prop.icon + '" width="30" height="30"></div>';
                prop.value.forEach(mat => {
                    htmlStr += '<div class="pallet-item-container" onmousedown="DD2022.setProperty(\'' + prop.title + '\', \'' + mat.id + '\')">';
                    htmlStr += '<img width="30" height="30" src="' + ltvs__source + '/thumbs/materials/' + mat.id + '.png">';
                    htmlStr += '<div class="itempalette-label">' + mat.title + '</div></div>';
                });

                htmlStr += '<div class="pallet-item-container" onmousedown="DD2022.setProperty(\'' + prop.title + '\', \'none\')">';
                htmlStr += '<img width="30" height="30" src="' + ltvs__source + '/icons/remove_all.png">';
                htmlStr += '<div class="itempalette-label">' + translations[ltvs__lang].remove_all + '</div></div>';

                htmlStr += '</div>';
                break;
            case 'alert_button':
                htmlStr += '<div class="removal-button" onmouseup="DD2022.deleteSelected()">';
                htmlStr += '<img width="24" height="24" style="box-shadow: 0 0 0 0;" src="' + ltvs__source + '/icons/delete_outline_white_24dp.svg">';
                htmlStr += '</div>';
                break;
            case 'normal_orientation':
                htmlStr += '<div class="pallet-item-container" ';
                htmlStr += 'onmousedown="DD2022.setProperty(\'' + prop.ui + '\', 1)">';
                htmlStr += itemFactory(prop.title, '', prop.id);
                htmlStr += '</div>';
                break;
            case 'mirror_orientation':
                htmlStr += '<div class="pallet-item-container" ';
                htmlStr += 'onmousedown="DD2022.setProperty(\'' + prop.ui + '\', 1)">';
                htmlStr += '<img style= "-webkit-transform: scaleX(-1); transform: scaleX(-1)" width="80" height="80" src="' + ltvs__source + '/thumbs/models/' + prop.id + '.png ">';
                htmlStr += '<div class="itempalette-label">' + prop.title + '</div>';
                htmlStr += '</div>';
                break;
            case 'text':
                let maxlength = '';
                let uppercase = '';
                if (prop.max) maxlength = 'maxlength="' + prop.max + '"';
                if (prop.uppercase) uppercase = "-upper";
                htmlStr += '<div class="property-holder">';
                htmlStr += '<input class="ltvs-text-input' + uppercase + '" ' + maxlength + ' type="text" oninput="DD2022.setProperty(\'' + prop.title + '\' ,this.value)" onchange="DD2022.setProperty(\'' + prop.title + '\' ,this.value)"  value="' + prop.value + '" >';
                htmlStr += '</div>';
                break;
            case 'html':
                htmlStr += '<div id="' + prop.title + '" class="property-holder"></div>';
                break;
            default:
                break;
        }

        return htmlStr;

    }



    return {

        createUI(obj, noclose = false) {
            if (!obj) return;
            let params = obj.signature;

            currentModel = params;

            let extHTML = [];

            //always add the top panel toggle button
            let htmlStr = '';
            if (noclose) {
                htmlStr += '<button id="panel-toggle" class="panel-toggle" style="width:100%"></button>';
            } else {
                htmlStr += '<button id="panel-toggle" class="panel-toggle" ></button><button id="designer-close" class="designer-close"><img src="' + ltvs__source + '/icons/close.png"></button>';
            }
            //display item properties
            if (obj.sku && obj.snap_type != "environment" && obj.sku != "none" && DD2022.products[obj.sku] != undefined) {
                htmlStr += '<button id="accgrp_des" class="accordion-bt">' + DD2022.getTranslation('properties') + '</button> <div class="panel"><div class="item-properties">';
                htmlStr += "<h3>" + DD2022.products[obj.sku].description + "</h3>";
                htmlStr += "<b>" + translations[ltvs__lang].price + ": </b> SEK " + DD2022.products[obj.sku].price + "<br>";
                htmlStr += "<b>SKU: </b><a href = '" + DD2022.products[obj.sku].link + "' target='_blank'>" + obj.sku + "</a><br>";
                htmlStr += "<b>" + DD2022.getTranslation('width') + ": </b>" + Math.round(obj.size.x * 100) + " cm<br>";
                htmlStr += "<b>" + DD2022.getTranslation('height') + ": </b>" + Math.round(obj.size.y * 100) + " cm<br>";
                htmlStr += "<b>" + DD2022.getTranslation('depth') + ": </b>" + Math.round(obj.size.z * 100) + " cm<br>";
                htmlStr += '</div></div>';
            }


            //if there are variants, add these next
            if (params.variants && params.variants.list) {
                htmlStr += '<button id="accgrp_var" class="accordion-bt">' + params.variants.title + '</button> <div class="panel">';
                params.variants.list.forEach(function (variant) {
                    htmlStr += '<div class="pallet-item-container" onmousedown="DD2022.loadModel(\'' + variant.id + '\', \'' + ltvs__lang + '\' , true)">';
                    htmlStr += '<img src="' + ltvs__source + '/thumbs/models/' + variant.id + '.png">';
                    htmlStr += '<div class="itempalette-label">' + variant.title + '</div></div>';
                });
                htmlStr += '</div>';
            }

            // if there are colour/material options, add these at the top of the panel
            if (params.materials && params.materials.list) {
                htmlStr += '<button id="accgrp_clr" class="accordion-bt">' + params.materials.title + '</button> <div class="panel">';
                params.materials.list.forEach(function (mat) {
                    htmlStr += '<div class="pallet-item-container" onmousedown="DD2022.decorManager.changeMaterial(\'' + params.default_material_key + '\', \'' + mat.id + '\' , \'' + mat.extension + '\')">';
                    htmlStr += '<img width="30" height="30" src="' + ltvs__source + '/thumbs/materials/' + mat.id + '.png">';
                    htmlStr += '<div class="itempalette-label">' + mat.title + '</div></div>';

                });
                htmlStr += '</div>';
            }

            let sectionSnapPoint = [];
            // add any accessory groups 
            if (params.accessories && params.accessories.length) {
                params.accessories.forEach(function (accgrp) {
                    sectionSnapPoint = [];
                    if (accgrp.list && accgrp.list.length > 0) {
                        accgrp.list.forEach(item => {
                            if (!sectionSnapPoint.includes(item.snap)) {
                                sectionSnapPoint.push(item.snap);
                            }
                            if (item.include && !sectionSnapPoint.includes(item.include) && item.include.length > 2) {
                                sectionSnapPoint.push(item.include.split('-')[0]);
                            }
                        });
                        //don't add a remove all button for slatbase 
                        if (sectionSnapPoint.length > 0 && sectionSnapPoint[0] != "slat" && accgrp.list[accgrp.list.length - 1].id != "remove_all") {
                            accgrp.list.push({ id: "remove_all", title: translations[ltvs__lang].remove_all, snap: sectionSnapPoint.join(), sku: 'remove_all' });
                        }
                    }
                    htmlStr += panelFactory(accgrp);
                });


            }
            //add flip
            if (params.params) {
                params.mirror = params.params.mirror;
                params.id = params.params.id;
            }
            if (params.mirror == 1) {
                console.log("add flip");
                // 
                htmlStr += '<button id="accgrp_mirror" class="accordion-bt">' + translations[ltvs__lang].mirror + '</button> <div class="panel">';
                let prop = { title: translations[ltvs__lang].normal, ui: "normal_orientation", id: params.id };
                htmlStr += uiElementFactory(prop);
                prop.title = translations[ltvs__lang].mirrored;
                prop.ui = "mirror_orientation"
                htmlStr += uiElementFactory(prop);
                htmlStr += '</div>';
            }



            //add editing properties
            if (params.properties) {
                //don't show for single objects, unless they have multiple properties (default is a delete button, not necessary with single object)
                //always show for rooms
                let propLength = params.properties.length;
                if (propLength > 1 || DD2022.checkMode() > 1 || params.snap_type == "environment") {
                    htmlStr += '<button id="accgrp_edit" class="accordion-bt">' + translations[ltvs__lang].edit + '</button> <div class="panel">';
                    params.properties.forEach(function (prop) {
                        if (prop.title != "remove" || DD2022.checkMode() > 1)
                            htmlStr += uiElementFactory(prop);
                        //load external HTML into created panel div
                        if (prop.ui == 'html') {
                            extHTML.push(prop);
                        }
                    });
                    htmlStr += '</div>';
                }
            }

            // add "shopping list" panel
            htmlStr += '<button id="shop-list" class="accordion-bt lister">'
            htmlStr += '<svg class="svg-icon" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>'
            htmlStr += '</button>'
            htmlStr += '<div class="panel" id="list-of-items"></div>'

            itempalette.innerHTML = htmlStr;
            // add function to accordian buttons
            var acc = document.getElementsByClassName("accordion-bt");
            var i;

            for (i = 0; i < acc.length; i++) {
                acc[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    closeOtherPanels(this);
                    var panel = this.nextElementSibling;
                    panel.style.display = "block";
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                        panel.style.display = "none";
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";

                    }
                    DD2022.decorManager.clearPreview();
                });
            }
            //add function to panel button

            let pt = document.getElementById('panel-toggle');
            pt.addEventListener("click", function () {
                let pan = document.getElementById('itempalette');
                pan.classList.toggle('panel-close');
                //pan.style.maxHeight = '20px';
                let tog = document.getElementById('panel-toggle');
                tog.classList.toggle('panel-closed');
                closeOtherPanels(null);

            })
            if (!noclose) {
                let closebt = document.getElementById('designer-close');
                closebt.addEventListener("click", function () {
                    document.getElementById("ltvs_container").style.display = "none";
                    document.getElementById("dialogboxholder").style.display = "none";
                    document.getElementById("buttonmenu").style.display = "none";

                });
            }
            //load external HTML
            if (extHTML.length > 0) {
                for (var h = 0; h < extHTML.length; h++) {
                    $('#' + extHTML[h].title).load(ltvs__source + "/html/" + extHTML[h].value);
                }
            }


            //open edit panel
            setTimeout(this.autoOpenEdit, 200);

        },



        autoOpenEdit() {
            let edit = document.getElementById('accgrp_des');
            if (edit) {
                edit.classList.toggle("active");
                var panel = edit.nextElementSibling;
                panel.style.display = "block";
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                    panel.style.display = "none";
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";

                }
            }

        },
        weedUnavailable() {
            //lowlight accesories with no snap points available

            let nodes = document.getElementsByClassName('pallet-item-container');
            let snapAvail;
            let available = [];
            let blocked = [];
            let snap;
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].classList.remove('not-available');
                snap = nodes[i].dataset.snap;
                if (snap && blocked.includes(snap)) {
                    nodes[i].classList.add('not-available');
                    continue;
                }
                if (snap && !available.includes(snap) && !blocked.includes(snap)) {

                    snapAvail = DD2022.decorManager.checkSnapAvailability(nodes[i].dataset.snap, nodes[i].dataset.exclude);
                    if (snapAvail < 1 && nodes[i].id != 'node_remove_all') {
                        nodes[i].classList.add('not-available');
                        blocked.push(snap);
                    } else {
                        available.push(snap);
                    };

                }
            }
            // let snapAvail = DD2022.decorManager.checkSnapAvailability(acc.snap,acc.exclude);



        },


        createList(decorObj, finish = '', checkmenu = true) {
            focusObj = decorObj;
            // Draws the shopping list under the main interface


            primesku = decorObj.sku;
            acc__array = [];
            let itemsList = document.getElementById('list-of-items');
            if (itemsList == undefined) return;
            materialExtension = finish;
            shoppingList = [];
            let i, ac;
            //dev__array = arr;
            let htmlStr = "";
            let cln, sku
            let rem = '';
            let totalHandles = 0;
            let handlesHandle, handlesTitle, handlesID;
            let accessories = decorObj.getAccessories();


            //start the menu with main object
            htmlStr += "<div class='pallet-list-item-container' >";
            htmlStr += itemFactory(decorObj.name, decorObj.sku, decorObj.decorId);
            htmlStr += "</div>";
            shoppingList.push(decorObj.sku);

            //add its accessories

            for (i = 0; i < accessories.length; i++) {
                let acc = accessories[i];

                //check if included in the main SKU
                if (!acc.includeByDefault) {
                    if (acc.snap_type == "all") {
                        totalHandles++;
                        handlesTitle = acc.sku;
                        handlesHandle = acc.sku;
                        handlesID = acc.decorId;
                        shoppingList.push(acc.sku);

                    } else {
                        acc__array.push(acc);

                        if (acc.className != undefined) {
                            let accIndex = acc__array.length - 1;
                            let accAccs = acc.getAccessories();
                            let hasAccs = false;
                            if (accAccs.length > 0) {
                                hasAccs = true;
                            }
                            //indent accessories
                            if (hasAccs) {
                                htmlStr += "<div id='acc__" + accIndex + "' class='pallet-list-item-container' >";
                            } else {
                                htmlStr += "<div id='acc__" + accIndex + "' class='pallet-list-item-container subitem' >";
                            }
                            htmlStr += itemFactory(acc.sku, acc.sku, acc.decorId);
                            htmlStr += '<div class="removal-bt" onclick="DD2022.removeItem(\'' + accIndex + '\', this)">x</div>';
                            htmlStr += "</div>";
                            shoppingList.push(acc.sku);
                        }
                    }
                }
            }
            //add any handles found
            if (totalHandles > 0) {
                htmlStr += "<div id='handles' class='pallet-list-item-container' >";
                cln = itemFactory(handlesTitle, handlesHandle, handlesID);
                rem = "<div class='removal-bt' onclick='DD2022.decorManager.removeBySKU(" + handlesHandle + ", null)'>x</div>";
                let count = "<div class='handle-count'>(x" + totalHandles + ")</div>";
                htmlStr += cln + rem + count + "</div>";
            }

            // add "shopping list" panel
            if (DD2022.checkMode() == 1) {
                htmlStr += '<button class="cart-button" onclick="DD2022.sendToExportScript()">'
            } else {
                htmlStr += '<button class="cart-button" onclick="DD2022.listFullDesign()">'
            }
            htmlStr += '<svg class="svg-icon" height="50px" viewBox="0 0 50 50">'
            htmlStr += '<g id="Icon_Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">'
            htmlStr += '<g id="shopping-cart" stroke="#FFFFFF" stroke-width="1.55">'
            htmlStr += '<circle id="Oval" cx="19.3636364" cy="33.1818182" r="1.81818182"></circle>'
            htmlStr += '<circle id="Oval" cx="30.2727273" cy="33.1818182" r="1.81818182"></circle>'
            htmlStr += '<path d="M17.2454545,19.5454545 L33,19.5454545 L31.4727273,27.1727273 C31.3011482,28.0365741 30.5351055,28.6532385 29.6545455,28.6363636 L20.0454545,28.6363636 C19.1268013,28.6441553 18.3466689,27.9654401 18.2272727,27.0545455 L16.8454545,16.5818182 C16.7269293,15.6778144 15.9571942,15.0013805 15.0454545,15 L13,15" id="Shape"></path>'
            htmlStr += '</g></g></svg><span style="margin: auto;">' + translations[ltvs__lang].add_to_cart + '<span></button>'

            document.getElementById('list-of-items').innerHTML = htmlStr;
            //add handle count */
            checkPrimeSku();
            //lowlight the unavailable
            setTimeout(this.weedUnavailable, 500);

        },



        removeItem(accInd) {

            let item = acc__array[accInd];
            item.parent.remove(item);
            $('#acc__' + accInd).remove();
            render();
            var accs = item.getAccessories();
            var accnode;
            //if item has children, remove them too.
            if (accs.length > 0) {
                accs.forEach(acc => {
                    //find index
                    for (var i = 0; i < acc__array.length; i++) {
                        if (acc === acc__array[i]) {
                            acc.parent.remove(acc);
                            $('#acc__' + i).remove();
                        }
                    }
                })
            }

        },

        sendToExportScript(layer) {
            shoppingList = [];
            layer.children.forEach((item, index) => {
                shoppingList.push(item.sku);
                let arr = item.getAccessories(); // returns all nested accessories
                arr.forEach(member => {
                    if (!member.includeByDefault) {
                        acc__array.push(member);
                        let accInd = acc__array.length - 1;
                        let multi = member.sku.split('__');
                        if (multi.length > 1) {
                            for (var m = 0; m < multi.length; m++) {
                                shoppingList.push(multi[m]);
                            }
                        } else {
                            shoppingList.push(member.sku);
                        }

                    }

                });
            });
            ltvs__sendToCart(shoppingList);
        },
        listDesign(layer, print = false) {
            shoppingList = [];
            let htmlStr = "";
            if (!print) {
                ltvs_listHolder.classList.add("cover-full");
                // let htmlStr = '<div class="login-close" onmouseup="DD2022.closeList()"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#a7b7a9"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></div>';
                htmlStr = "<div class='cat-but' onmousedown='DD2022.closeList()'><img style='box-shadow:none;'  class='no-drop' width='24px' height='24px' src='" + ltvs__source + "/icons/arrow_back_black_24dp.svg'></div>";
            }
            acc__array = [];
            if (layer.children.length < 1) {
                this.closeList();
                this.clearUI();
                return;
            }

            let SKUlist = [];
            let idList = {};
            layer.children.forEach((item, index) => {

                SKUlist.push(item.sku);
                idList[item.sku] = item.decorId;
            });
            let skuSet = new Set(SKUlist);
            for (const item of skuSet) {
                console.log(item); // 👉️ one, two, three, four
                let details = DD2022.products[item];
                if (details != undefined) {
                    shoppingList.push({ sku: item, quantity: this.getQuantity(item, SKUlist), name: details.description, price: details.price, decorId: idList[item] });
                } else if (item != 'none' && item != "") {
                    alert("Product not found " + item);
                }
            }
            shoppingList.sort(this.compare);
            console.log(shoppingList);
            htmlStr += "<div id='itemlistcontainer'><table id='itemlisttable' width='100%' border='1'><tr><th width='5%' scope='col'>" + translations[ltvs__lang].number + "</th><th width='15%' scope='col'>" + translations[ltvs__lang].sku + "</th><th width='55%' scope='col'>" + translations[ltvs__lang].description + "</th><th width='15%' scope='col'>" + translations[ltvs__lang].price + "</th><th width='10%' scope='col'>" + translations[ltvs__lang].total + "</th></tr>";
            var totPrice = 0;
            shoppingList.forEach((item, index) => {
                // shoppingList.push(item.sku);
                let tot = item.quantity * item.price;
                totPrice += tot;
                htmlStr += "<tr><th width='5%' scope='col'>" + item.quantity + "</th><th width='15%' scope='col'>" + item.sku + "</th><th width='55%' scope='col'>" + item.name + "</th><th width='15%' scope='col'>" + item.price + "</th><th width='10%' scope='col'>" + tot + "</th></tr>";

            });
            var totalText = "Totalt SEK";
            htmlStr += "<tr><th width='5%' scope='col'>" + totalText + "</th><th width='15%' scope='col'></th><th width='55%' scope='col'></th><th width='15%' scope='col'></th><th width='10%' scope='col'>" + totPrice + "</th></tr>";
            htmlStr += "</table></div>";
            if(!print){
            htmlStr += '<button class="cart-button" onclick="DD2022.sendToExportScript()"><div style="margin:auto">'
            htmlStr += '<svg class="svg-icon" height="50px" viewBox="0 0 50 50">'
            htmlStr += '<g id="Icon_Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">'
            htmlStr += '<g id="shopping-cart" stroke="#FFFFFF" stroke-width="1.55">'
            htmlStr += '<circle id="Oval" cx="19.3636364" cy="33.1818182" r="1.81818182"></circle>'
            htmlStr += '<circle id="Oval" cx="30.2727273" cy="33.1818182" r="1.81818182"></circle>'
            htmlStr += '<path d="M17.2454545,19.5454545 L33,19.5454545 L31.4727273,27.1727273 C31.3011482,28.0365741 30.5351055,28.6532385 29.6545455,28.6363636 L20.0454545,28.6363636 C19.1268013,28.6441553 18.3466689,27.9654401 18.2272727,27.0545455 L16.8454545,16.5818182 C16.7269293,15.6778144 15.9571942,15.0013805 15.0454545,15 L13,15" id="Shape"></path>'
            htmlStr += '</g></g></svg><span style="position:relative;top:-20px">' + translations[ltvs__lang].add_to_cart + '<span></div></button>'
           
                ltvs_listHolder.innerHTML = htmlStr;
            }else{
                return htmlStr;
            }
        },
        compareSKU(a, b) {
            if (a.sku < b.sku) {
                return -1;
            }
            if (a.sku > b.sku) {
                return 1;
            }
            return 0;
        },
        getQuantity(sku, quantityList) {
            let q = 0;
            for (var i = 0; i < quantityList.length; i++) {
                if (quantityList[i] == sku) q++;
            }
            return q;
        },

        closeList() {
            ltvs_listHolder.innerHTML = '';
            ltvs_listHolder.classList.remove("cover-full");
        },

        clearUI(noclose = false) {
            // itempalette.innerHTML = '';

            updateUI([]);
            this.createUI({ signature: {} }, noclose);
        },
        getFromAccArray(ind) {
            return acc__array[ind];
        }


    }

})();



export default DecorUI;

document.addEventListener('keydown', logKey);

function logKey(e) {
    // console.log ( ` ${e.code}` );
    if (e.code == "KeyG" && e.ctrlKey) DD2022.decorManager.exportSingle();
}

