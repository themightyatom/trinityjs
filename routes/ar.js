const express = require('express');
const router = express.Router();
var multer  = require('multer');

let armax = 10;
let arcount = 0;


const arstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, 'tmp' );
    }

})


const upload= multer({
    storage:arstorage
  });

var fs = require('fs');



/** Permissible loading a single file, 
    the value of the attribute "name" in the form of "recfile". **/

router.post('/upload', upload.single('file'), function (req,res) {

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'public/upload/model' + arcount + '.glb';

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { 
      res.send({message:'complete', count:arcount}); 
      arcount++;
      if(arcount > armax) arcount = 0; 
    });
  src.on('error', function(err) { res.send({message:'error'}); });

});

router.get('/open/:count', function(req,res){
    console.log("getting",req.params.count );
    res.render('arlaunch', {layout:'ar',count:req.params.count});
})

module.exports = router;