// THIS IS A JAVASCRIPT FILE

const ltvs__server = 'https://ltvs.customshop.online';
let shoppingList;
let quantityList;
let listLength;
let _lang = document.getElementsByTagName("html")[0].getAttribute("lang");

function ltvs__sendToCart(itemlist){
    quantityList = itemlist;
    listLength = new Set(quantityList).size;
    ltvs__cartgraphic();
    var xhr = new XMLHttpRequest();

    var data = new FormData();
    data.append("list", itemlist);
    data.append("merchant", ltvs__merchant);
    //Send the proper header information along with the request
    xhr.onload = function (e) {
        shoppingList = e.target.response.result;
        ltvs__sendNextItem();
    };
    xhr.open('POST', ltvs__server + "/merchant/getwebshopids", true);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.responseType = 'json';
    xhr.send(data);
}
function ltvs__sendNextItem() {
    if (shoppingList.length > 0) {
        var item = shoppingList.pop();
        var q = getQuantity(item.model_id);
        var product = {id:item.webshop_id,quantity:q};
        ltvs__addToCart(product);
        $("#item-counter").text(Number(listLength - shoppingList.length) + " of " + listLength + " items to cart");
    } else {
     var cartpath;
      if(_lang == 'da'){
        cartpath = 'https://lifetimekidsrooms.dk/cart';
      }else{
        
         cartpath = 'https://lifetimekidsrooms.dk/' + _lang +'/cart';
      }
       location.href = cartpath ;
      //closeConfig();
    }
}
function getQuantity(sku){
    let q = 0;
    for(var i=0;i<quantityList.length;i++){
        if(quantityList[i] == sku) q++;
    }
    return q;
}
function ltvs__cartgraphic(){
  var dia = document.getElementById('dialogboxholder');
  dia.innerHTML = '<div id="exporting" class="exporting"><img width="200px" src="' + ltvs__server + '/imgs/cart.gif" ><p><span>Adding </span><span id="item-counter"><span></p></div>';  
}

function ltvs__addToCart(product) {
    console.log("ADDING TO CART", product);

    jQuery.ajax({
        type: "POST",
        url: 'https://lifetimekidsrooms.dk/cart/add.js',
      dataType: 'json', 
        data: product,
        success: function (e) {
           
        },
        error:function(request, status, error){
            console.log("ERROR", request, status, error);

        },
        complete:function(e){
            console.log("COMPLETE",e.responseJSON.description);
            if(e.responseJSON.status == 422){
                alert(e.responseJSON.description);
            }
            ltvs__sendNextItem();
        }
    })

    //closeConfig();
}

window.ltvs__sendToCart = ltvs__sendToCart;