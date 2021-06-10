// THIS IS A JAVASCRIPT FILE

const ltvs__server = 'https://ltvs.customshop.online';
let shoppingList;

function ltvs__sendToCart(itemlist){
    var xhr = new XMLHttpRequest();

    var data = new FormData();
    data.append("list", itemlist);
    data.append("merchant", ltvs__merchant);
    //Send the proper header information along with the request
    xhr.onload = function (e) {
        shoppingList = e.target.response.result;
        ltvs__sendNextProduct();
    };
    xhr.open('POST', ltvs__server + "/merchant/getwebshopids", true);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.responseType = 'json';
    xhr.send(data);
}
function ltvs__sendNextProduct() {
    if (shoppingList.length > 0) {
        var item = shoppingList.pop();
        var product = {id:item.webshop_id,quantity:1};
        ltvs__addToCart(product);
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

function ltvs__addToCart(product) {
    console.log("ADDING TO CART", product);

    jQuery.ajax({
        type: "POST",
        url: 'https://lifetimekidsrooms.dk/cart/add.js',
      dataType: 'json', 
        data: product,
        success: function (e) {
            if (e.error & e.product_url) {
                window.location = e.product_url;
                return
            }
            //  jQuery(document.body).trigger("added_to_cart", [e.fragments, e.cart_hash, c])
            sendNextProduct();
        },
    })

    //closeConfig();
}

window.ltvs__sendToCart = ltvs__sendToCart;