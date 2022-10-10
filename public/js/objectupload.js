let focusFile = "";
    let previewLoaded = false;
    function validateUpload(event) {
        console.log("Is loaded?" + previewLoaded)
        if (previewLoaded) {
            return true;
            console.log("send");
        } else {
            alert("Please select a trinity object from your hard drive");
            return false;

        }

    }
    function checkExist(e) {
        var filename = e.target.value.replace(/^.*[\\\/]/, ''); // use last index /substr
        if (filename == "") {
            alert("Please select a file");
            return false;
        }
        JSZip.loadAsync(e.target.files[0])                                   // 1) read the Blob
            .then(function (zip) {


                zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                    console.log(zipEntry.name);
                    if (zipEntry.name.split('.').pop() == "glb") {

                        fetch('/models/glbexists/' + zipEntry.name)
                            .then(response => response.json())
                            .then(data => {
                                var m = document.getElementById('message');
                                if (data == true) {
                                    m.innerHTML = '<span style="color:#ce0000"><h3>The model ' + zipEntry.name + ' already exists on the server<br>NB: Upload will overwrite existing file</h3></span><p><h3>Choose another file or upload with another name</h3></p><button onclick="loadCompare()">Compare</button><button onclick="cancel()">Cancel</button>';
                                } else {
                                    m.innerHTML = '<h3>Model ' + zipEntry.name + ' ready for upload</h2><h2>Preview:</h2>';
                                }
                            })
                            .then(data => {
                                console.log("model", zip.file(zipEntry.name));
                                zip.file(zipEntry.name).async('blob').then(function (content) {
                                    let reader = new FileReader();
                                    reader.onloadend = function () {
                                        //var model = URL.createObjectURL(file);
                                        let snapPoints = loadDataAsModel(reader.result);
                                        document.getElementById("container").style.visibility = "visible";
                                        previewLoaded = true;
                                        console.log(snapPoints);
                                    }
                                    reader.readAsArrayBuffer(content);
                                });
                            });

                    }
                    if (zipEntry.name.split('.').pop() == "js") {

                        fetch('/models/classexists/' + zipEntry.name)
                            .then(response => response.json())
                            .then(data => {
                                var cm = document.getElementById('cls-message');
                                if (data == true) {
                                    cm.innerHTML = '<span style="color:#ce0000"><h3>The class ' + zipEntry.name + ' already exists on the server<br>NB: Upload will overwrite existing file</h3></span><p><h3>Choose another file or upload with another name</h3></p><button onclick="loadCompare()">Compare</button><button onclick="cancel()">Cancel</button>';
                                } else {
                                    cm.innerHTML = '<h3>Model ' + zipEntry.name + ' ready for upload</h2><h2>Preview:</h2>';
                                }
                            });

                            // Could display object as it's actual class?
                            /*.then(data => {
                                console.log("model", zip.file(zipEntry.name));
                                zip.file(zipEntry.name).async('blob').then(function (content) {
                                    let reader = new FileReader();
                                    reader.onloadend = function () {
                                        //var model = URL.createObjectURL(file);
                                        let snapPoints = loadDataAsModel(reader.result);
                                        document.getElementById("container").style.visibility = "visible";
                                        previewLoaded = true;
                                        console.log(snapPoints);
                                    }
                                    reader.readAsArrayBuffer(content);
                                });
                            }); */

                    }
                });
            }, function (e) {

                alert("Error reading " + e.target.files[0].name + ": " + e.message);

            });


        //focusFile = filename;
        let file = e.target.files[0];
        console.log("test", focusFile);


       /* return;
        let reader = new FileReader();
        reader.onloadend = function () {
            console.log("sending model");
            //var model = URL.createObjectURL(file);
            let snapPoints = loadDataAsModel(reader.result);
            document.getElementById("container").style.visibility = "visible";
            previewLoaded = true;
            console.log(snapPoints);
        }
        reader.readAsArrayBuffer(file);*/
    }
    function registerSnaps(arrayOfSnapPoints) {
        console.log("snap points", arrayOfSnapPoints);
    }
    function loadCompare() {
        console.log("load comparison");
        loadModel(focusFile);
        document.getElementById("compare").style.visibility = "visible";
    }
    function updateCameraPos(cam) {
        setCamPos(cam);
        render();
    }
    function cancel() {
        location.reload();
    }