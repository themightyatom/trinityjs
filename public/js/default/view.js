



//find product number from page
let ltvs__merchant = 'default';
let ltvs__source = ''; //https://ltvs.customshop.online';

const ltvs__launchDiv = document.createElement("div");
let htmlElement = document.querySelector("html");
//const ltvs__lang = htmlElement.getAttribute("lang");
const ltvs__lang = 'none';




//if the product configurator is called upon, create a window and load 
//the necessary additional scripts...

function ltvs__launch(){
  // already created, show the previously hidden windows
  if(document.body.contains(document.getElementById("ltvs_container"))){
    document.getElementById("ltvs_container").style.display = "block";
    document.getElementById("dialogboxholder").style.display = "block";
    return;
  }
  
  // create window for configurator
  const ltvs__window = document.createElement("div");
  ltvs__window.setAttribute("id", "ltvs_container");
  document.body.appendChild(ltvs__window);
  
  ltvs__loadStyle()
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
   console.log("got here", ltvs__designid);
   DD2022.openDesign(ltvs__designid);

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
ltvs__launch();

