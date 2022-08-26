

class ModelUpload {
    constructor(){
        this.dialog;

    }


        openFromHD(){
            console.log("OPENING MODEL");
            this.dialog = document.createElement("div");
            this.dialog.classList.add('upload-dialog');
            this.dialog.innerHTML = '<label for="file-upload">Choose .glb,.dvs,.jpg or .png file</label><input onchange="DD2022.importFile(this)" name="file-upload" class="input-hide" type="file" id="file-upload" /><div class="upload-dialog-close" onclick="DD2022.closeUpload()"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fe4545"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg></div>';
            let diog = document.getElementById('buttonmenu');
            diog.appendChild(this.dialog);
           // document.getElementById('file-upload').addEventListener('change', this.readURL, false);
        }
        readURL(input){

            if (input.files && input.files[0]) {
                var reader = new FileReader();
                let extension = input.files[0].name.split('.').pop();
                switch(extension){
                    case 'glb':
                        reader.onload = function (e) {
                            let contents = event.target.result;
                            DD2022.addImportedFile(contents);
                        }
                        reader.readAsArrayBuffer( input.files[0] );
                    break;
                    case 'dvs':
                        reader.onload = function (e) {
                            let contents = event.target.result;
                            let data = {design:contents, message:"user content"};
                            console.log("result?", contents);
                            DD2022.loadDesign(data);
                        }
                        reader.readAsText(input.files[0]);
                    break;
                    case 'jpg':
                    case 'png':
                        reader.onload = function (e) {
                            let contents = event.target.result;
                            DD2022.createPicture(contents);
                        }
                        reader.readAsDataURL(input.files[0]);
                    break;
                    default:
                        alert("File type not supported");
                    break;
                }
                

            }
            DD2022.closeUpload();
        }

        /*readURL(input) {
            
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var contents = event.target.result;
                    var loader = new THREE.GLTFLoader();
                    loader.parse( contents, '', function ( gltf) {

                        gltf.scene.traverse( function ( child ) {

                            if ( child.isMesh ) {

                                

                              switch(child.name.substr(0,4)){
                                case 'wood':
                                   
                                    child.material = SharedMaterials.getMaterialFromID('lightWood');
                                   
                                    break;
                                case 'glas':
                                    child.material = SharedMaterials.getMaterialFromID('glass');
                                    break;
                                default:
                                    break;

                              }

                              console.log("MATERIAL", child.name, child.material);

                            }

                        } );

                        userLayer.add( gltf.scene );
                
                    } );
                   ModelLoader.close();
                };
                reader.readAsArrayBuffer( input.files[0] );

            }
        }*/
        
        close(){
            $( ".upload-dialog" ).remove();
        }

    
}

export default ModelUpload