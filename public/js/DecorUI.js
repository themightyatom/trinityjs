


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

    /*  const panelToggle = document.createElement("button");
      panelToggle.setAttribute("id", "panel-toggle");
      panelToggle.classList.add("panel-toggle");
      panelToggle.setAttribute("onclick", "togglePanel()");
      itempalette.appendChild(panelToggle); */

    let dev__array;
    let deluxe = 'unset';
    let materialExtension = '';
    let primesku = '';
    let shoppingList;

    function closeOtherPanels(exempt) {
        var acc = document.getElementsByClassName("accordion-bt");
        var i;
        for (i = 0; i < acc.length; i++) {
            var but = acc[i];
            if (but != exempt) {
                but.classList.remove('active');
                var panel = but.nextElementSibling;
                panel.style.maxHeight = null;
            }
        }
    }
    function itemFactory(title, sku, id) {
        let htmlStr = '';
        htmlStr += '<img id="img_' + sku + '" width="80" height="80" src="'+ ltvs__source +'/thumbs/models/' + id + '.png ">';
        htmlStr += '<div id="tit_' + sku + '" class="itempalette-label">' + sku + '</div>';
        return htmlStr;
    }

    function panelFactory(accgrp) {
        let htmlStr = '';
        htmlStr += '<button id="accgrp_' + accgrp.id + '" class="accordion-bt grp">' + accgrp.title + '</button> <div id="accpan_' + accgrp.id + '" class="panel">';
        if (accgrp.list) {
            accgrp.list.forEach(function (acc) {
                htmlStr += '<div id="node_' + acc.sku + '" class="pallet-item-container" ';
                htmlStr += 'onmousedown="addAccessory(\'' + acc.id + '\',\'' + acc.snap + '\',\'' + acc.model + '\',\'' + acc.sku + '\',\'' + acc.snap_type + '\',\'' + acc.exclude + '\',\'' + acc.include + '\',\'' + acc.default_material + '\',\'' + acc.default_material_key + '\')">';
                htmlStr += itemFactory(acc.title, acc.sku, acc.id);
                htmlStr += '</div>';

            });
        }
        htmlStr += '</div>';
        return htmlStr
    }

    function checkPrimeSku() {
        var base = primesku.split('-');
        if (base.length < 2) return;
        if (materialExtension.length > 0) base[1] = materialExtension;
        if (deluxe == 'yes') {
            if (base[0].charAt(base[0].length - 1) == '1') {
                return;
            } else {
                base[0] = base[0] + '1';
            }
        }
        if (deluxe == 'no') {
            if (base[0].charAt(base[0].length - 1) == '1') {
                base[0] = base[0].substr(0, base.length - 1);
            }
        }
        document.getElementById("tit_" + primesku).innerHTML = base[0] + "-" + base[1];
        shoppingList[0] = base[0] + "-" + base[1];
    }

    function getAllAccessories() {
        var xhr = new XMLHttpRequest();

        var data = new FormData();
        data.append("list", shoppingList);
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
        console.log("accessory groups", accessory_groups);
        //check that all accessories are there
        let accbts = document.getElementsByClassName('accordion-bt grp');
        for (var i = 0; i < accbts.length; i++) {
            let _id = accbts[i].id.substr(7);

            if (!accessory_groups.includes(_id)) {
                console.log("remove ", _id);
                removeElement('accgrp_' + _id);
                removeElement('accpan_' + _id);
            }
        };
        accessory_groups.forEach(function (grp) {
            let tab = document.getElementById('accgrp_' + grp);
            if (!tab) {
                console.log("missing accessory group", grp);
                addAccessoryGroup(grp);
            }
        });
    }

    function removeElement(id) {
        var elem = document.getElementById(id);
        return elem.parentNode.removeChild(elem);
    }

    function addAccessoryGroup(id) {

        fetch(ltvs__source + "/clients/accessory-group/" + id)
            .then(response => response.json())
            .then(data => {
                console.log(data.accessories);
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
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                    clearPreview();
                });
            });
    }
    function createElementFromHTML(htmlString, index) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        return div.childNodes[index];
    }





    return {

        createUI(materials, accessories, materialkey) {
            //always add the top panel toggle button
            let htmlStr = '<button id="panel-toggle" class="panel-toggle"></button><button id="designer-close" class="designer-close"><img src="'+ ltvs__source + '/icons/close.png"></button>';

            // if there are colour/material options, add these at the top of the panel
            if (materials.list) {
                htmlStr += '<button id="accgrp_clr" class="accordion-bt">' + materials.title + '</button> <div class="panel">';
                materials.list.forEach(function (mat) {
                    htmlStr += '<div class="pallet-item-container" onmousedown="changeMaterial(\'' + materialkey + '\', \'' + mat.id + '\' , \'' + mat.extension + '\')">';
                    htmlStr += '<img width="30" height="30" src="'+ ltvs__source +'/thumbs/materials/' + mat.id + '.png">';
                    htmlStr += '<div class="itempalette-label">' + mat.title + '</div></div>';

                });
                htmlStr += '</div>';
            }
            // add any accessory groups 
            if (accessories.length) {
                accessories.forEach(function (accgrp) {
                    htmlStr += panelFactory(accgrp);
                });

            }

            // add "shopping list" panel
            htmlStr += '<button id="shop-list" class="accordion-bt lister">'
            htmlStr += '<svg class="svg-icon" height="50px" viewBox="0 0 50 50">'
            htmlStr += '<g id="Icon_Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">'
            htmlStr += '<g id="shopping-cart" stroke="#292929" stroke-width="1.55">'
            htmlStr += '<circle id="Oval" cx="19.3636364" cy="33.1818182" r="1.81818182"></circle>'
            htmlStr += '<circle id="Oval" cx="30.2727273" cy="33.1818182" r="1.81818182"></circle>'
            htmlStr += '<path d="M17.2454545,19.5454545 L33,19.5454545 L31.4727273,27.1727273 C31.3011482,28.0365741 30.5351055,28.6532385 29.6545455,28.6363636 L20.0454545,28.6363636 C19.1268013,28.6441553 18.3466689,27.9654401 18.2272727,27.0545455 L16.8454545,16.5818182 C16.7269293,15.6778144 15.9571942,15.0013805 15.0454545,15 L13,15" id="Shape"></path>'
            htmlStr += '</g></g></svg></button>'
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
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                    clearPreview();
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
            let closebt = document.getElementById('designer-close');
            closebt.addEventListener("click", function(){
                document.getElementById("ltvs_container").style.display = "none";
                document.getElementById("dialogboxholder").style.display = "none";
            });
        },

        createList(arr, defaultSkus = [], finish = '', checkmenu = true) {
            
            let itemsList = document.getElementById('list-of-items');
            if (itemsList == undefined) return;
            materialExtension = finish;
            shoppingList = [];
            let i, ac;
            dev__array = arr;
            let htmlStr = "";
            let cln, sku
            let rem = '';
            let totalHandles = 0;
            let handlesHandle, handlesTitle, handlesID;
            let accessories;
            deluxe = 'unset';
            // for any group members, do not render, and add accesories to main object
            let rootAccessories = [];
            for (i = 0; i < arr.length; i++) {
                if (arr[i].isGroupMember) {
                    rootAccessories = rootAccessories.concat(arr[i].getAccessories());
                }
                if (!defaultSkus.includes(arr[i].sku)) shoppingList.push(arr[i].sku);

                //assign indexes for later removal. Allows for change of graphic order and reassignment 
                let accs = arr[i].getAccessories();
                for (ac = 0; ac < accs.length; ac++) {
                    accs[ac].removalIndex = [i, ac];
                    if (!defaultSkus.includes(accs[ac].sku)) shoppingList.push(accs[ac].sku);

                }

            }
            for (i = 0; i < arr.length; i++) {
                sku = arr[i].sku;
                if (i == 0) primesku = sku;

                cln = itemFactory(arr[i].name, arr[i].sku, arr[i].decorid);
                accessories = [];
                if (!arr[i].isGroupMember || i == 0) {
                    htmlStr += "<div class='pallet-list-item-container' >";
                    if (i > 0) {
                        rem = "<div class='removal-bt' onclick='removeItem(" + i + ", null)'>x</div>";
                        accessories = accessories.concat(arr[i].getAccessories());
                    } else {
                        accessories = rootAccessories;
                    }
                    htmlStr += cln + rem + "</div>";

                    //reorder as they appear on the object
                    accessories.sort((a, b) => (a.position.y < b.position.y) ? 1 : -1);
                    for (ac = 0; ac < accessories.length; ac++) {
                        if (!accessories[ac].isGroupMember && !defaultSkus.includes(accessories[ac].sku)) {
                            if(accessories[ac].snap_type != 'all'){
                                sku = accessories[ac].sku;
                                cln = itemFactory(accessories[ac].name, accessories[ac].sku, accessories[ac].decorid);
                                htmlStr += "<div class='pallet-list-item-container subitem' >";
                                rem = "<div class='removal-bt' onclick='removeItem(" + accessories[ac].removalIndex[0] + "," + accessories[ac].removalIndex[1] + ")'>x</div>";
                                htmlStr += cln + rem + "</div>";
                            }else{
                                totalHandles++;
                                handlesTitle = accessories[ac].sku;
                                handlesHandle = accessories[ac].sku;
                                handlesID = accessories[ac].decorid;
                            }

                        }
                        if (accessories[ac].sku == '610C') deluxe = 'no';
                        if (accessories[ac].sku == '6101C') deluxe = 'yes';
                    }
                }
            }
            //add any handles found
            if (totalHandles > 0) {
                htmlStr += "<div id='handles' class='pallet-list-item-container' >";
                cln = itemFactory(handlesTitle, handlesHandle, handlesID);
                rem = "<div class='removal-bt' onclick='dev__removeBySKU(" + handlesHandle + ", null)'>x</div>";
                let count = "<div class='handle-count'>(x" + totalHandles + ")</div>";
                htmlStr += cln + rem + count + "</div>";
            }
            htmlStr += "<button class='cart-button' onclick='ltvs__sendToExportScript()'>Add to basket</button>";
            document.getElementById('list-of-items').innerHTML = htmlStr;
            //add handle count */
            checkPrimeSku();
            if (checkmenu) getAllAccessories();
        },



        removeItem(objInd, accInd) {

            let item = dev__array[objInd];
            if (accInd != null) {
                item.removeAccessory(item.getAccessories()[accInd]);
                createList(dev__removeItem());
            } else {
                createList(dev__removeItem(item));
            }

            //remove html element
            // $(element.parentNode).remove();
        },

        sendToExportScript() {
            ltvs__sendToCart(shoppingList);
        }


    }

})();



export default DecorUI;

document.addEventListener('keydown', logKey);

function logKey(e) {
  console.log ( ` ${e.code}` );
  if(e.code == "KeyG") ltvs__export();
}

