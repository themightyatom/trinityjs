
const ltvs__lang = "none";

//if the product configurator is called upon, create a window and load 
//the necessary additional scripts...

function ltvs__launch(){
  // create window for configurator
  const ltvs__window = document.createElement("div");
  ltvs__window.setAttribute("id", "ltvs_container");
  document.body.appendChild(ltvs__window);
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

ltvs__loadScript('/js/DD2022.js')
 .then(ltvs__loadScript('/js/default/cart.js'))
  .then(() => {
    
     // getModelFromSKU('000','none',ltvs__modelid);
     // console.log("opening", window.ltvs__modelid);
  })
  .catch(() => console.error('Something went wrong loading scripts'));

}

function ltvs__loadStyle(){

  ltvs__loadCSS( '/css/default/designer.css')
    .then(() => {
      ltvs__showConfigurator();
    })
    .catch(() => console.error('Something went wrong.'));
  
}

