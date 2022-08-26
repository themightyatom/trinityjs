



//find product number from page
let ltvs__merchant = 'lifetimecom';
let ltvs__source = 'https://ltvs.customshop.online';
let ltvs__idelement = "ProductSelect-product-template";
//let ltvs__productid =  document.getElementById(ltvs__idelement).value;
//let ltvs__modelid;
const ltvs__launchDiv = document.createElement("div");
let htmlElement = document.querySelector("html");
//const ltvs__lang = htmlElement.getAttribute("lang");
const ltvs__lang = 'none';
//Check for design id
const ltvs__queryString = window.location.search;
const ltvs__urlParams = new URLSearchParams(ltvs__queryString);
const ltvs__designid = ltvs__urlParams.get('designid');


// determine if this is a configurable product
/*fetch(ltvs__source + '/merchant/checkproduct/' + ltvs__merchant + '-' + ltvs__productid)
.then(response => response.json())
        .then(data => {
            if(data.exists){
                console.log("model found", data.id);
                ltvs__modelid = data.id;
                // load the CSS file
                ltvs__loadButtonCSS(); 
            }else{
                console.log("no model found");
            }
        })
*/
//if so create a button that opens the product configurator

function ltvs__createbutton(){
  
  
  // create a new div element
  
  // and give it some content
  ltvs__launchDiv.innerHTML = '<img src="' + ltvs__source + '/imgs/cube.gif"><span>DESIGN 3D</span>';
  

  ltvs__launchDiv.setAttribute("onclick", "ltvs__launch()");
  ltvs__launchDiv.setAttribute("onmouseenter", "ltvs__showLaunch()");
  ltvs__launchDiv.setAttribute("onmouseleave", "ltvs__hideLaunch()");
 ltvs__launchDiv.classList.add("ltvs-launcher");
  document.body.appendChild(ltvs__launchDiv);
  ltvs__showLaunch();
  setTimeout(ltvs__hideLaunch,2000);
}

function ltvs__showLaunch(){

  ltvs__launchDiv.classList.remove("hide-launch");
  //ltvs__launchDiv.classList.add("neutral");
  ltvs__launchDiv.classList.add("show-launch");
}

function ltvs__hideLaunch(){

 ltvs__launchDiv.classList.remove("show-launch");
  ltvs__launchDiv.classList.add("hide-launch");
}


//if the product configurator is called upon, create a window and load 
//the necessary additional scripts...

function ltvs__launch(){
  // already created, show the previously hidden windows
  if(document.body.contains(document.getElementById("ltvs_container"))){
    document.getElementById("ltvs_container").style.display = "block";
    document.getElementById("dialogboxholder").style.display = "block";
    document.getElementById("buttonmenu").style.display = "block";
    return;
  }
  
  // create window for configurator
  const ltvs__window = document.createElement("div");
  ltvs__window.setAttribute("id", "ltvs_container");
  document.body.appendChild(ltvs__window);
  ltvs__hideLaunch();
  ltvs__loadStyle();
  //ltvs__showConfigurator();
}

/**
 * Loads a JavaScript file and returns a Promise for when it is loaded
 */
 const ltvs__loadScript = src => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'module';
      script.onload = resolve
      script.onerror = reject
      script.src = src
      document.head.append(script)
    })
  }

  const ltvs__loadCSS = src => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = resolve
      link.onerror = reject
      link.href = src
      document.head.append(link)
    })
  }

function ltvs__showConfigurator(){

ltvs__loadScript(ltvs__source + '/js/initDD2022PRO.js')
 .then(ltvs__loadScript(ltvs__source + '/js/'+ltvs__merchant+'/cart.js'))

  .then(() => {
    // now safe to use jQuery and jQuery UI, which depends on jQuery
    //  getModelFromSKU('000',ltvs__lang,ltvs__modelid);
    //new DD2022(ltvs__modelid,ltvs__lang);
   console.log("got here");
   if(ltvs__designid){
    DD2022.openSharedDesign(ltvs__designid,ltvs__lang);
  }else{
   // DD2022.loadModel(ltvs__modelid,ltvs__lang);
  }

  })
  .catch(() => console.error('Something went wrong loading scripts'));

}

function ltvs__loadStyle(){

  ltvs__loadCSS( ltvs__source + '/css/' + ltvs__merchant + '/pro.css')
    .then(() => {
      ltvs__showConfigurator();
    })
    .catch(() => console.error('Something went wrong.'));
  
}

function ltvs__loadButtonCSS(){
  ltvs__loadCSS( ltvs__source + '/css/' + ltvs__merchant + '/ltvs__launcher.css')
    .then(() => {
      //ready to create the button element
      ltvs__createbutton();
    })
    .catch(() => console.error('Something went wrong.'));
}


/*
if(ltvs__designid){
  ltvs__launch();
}else{
  // determine if this is a configurable product
  ltvs__loadButtonCSS(); 
}*/
ltvs__launch();