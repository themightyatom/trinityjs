// THIS IS A JAVASCRIP FILE
let ltvs__server = '';

function ltvs_sendToCart(itemlist){
    var xhr = new XMLHttpRequest();

    var data = new FormData();
    data.append("list", itemlist);
    data.append("merchant", ltvs__merchant);
    //Send the proper header information along with the request
    xhr.onload = function (e) {
        ltvs_sendItems(e.target.response.result);
    };
    xhr.open('POST', ltvs__server + "/merchant/getwebshopids", true);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.responseType = 'json';
    xhr.send(data);
}

function ltvs_sendItems(list){
    list.forEach(function (item){
        console.log(item);
    })
   
}



window.ltvs_sendToCart = ltvs_sendToCart;
