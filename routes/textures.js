const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../utils/db.js');
const sharp = require('sharp');

const fs = require('fs');
const path = require('path');
const { Recoverable } = require('repl');

const texfolder = 'public/textures/';
const thumbfolder = 'public/thumbs/textures/';
const _table = 'textures';

const imagePath = path.join(path.resolve(__dirname, '..'), 'public/textures/');





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, texfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

router.get('/', (req,res) =>{
    let sql = 'SELECT * FROM ' + _table;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('textureList', { textures: result, title: 'Textures' });
    })
    
});

router.get('/edit/:id', checkAuthenticated, (req, res) => {
    let _id = req.params.id;
    let sql = "SELECT * from " + _table + " WHERE ID ='" + _id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('editTexture', result[0]);
    });
});

router.post('/edit', checkAuthenticated, (req,res) =>{
    
    let sql = "UPDATE "+ _table +" SET ? WHERE id = '" + req.body.id + "'";
     
        let post = req.body;
        delete post.submit;
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/textures');
        });
});

router.get('/upload', (req,res) => {
 res.render('textureUpload');
});
router.post('/upload', upload.single('file-to-upload'), (req,res) =>{
    let texture = req.file.originalname;
    // Check for database entry with same file name
    let sql = "SELECT * from " + _table + " WHERE texture ='" + texture + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            let id = result[0].id;
            res.render('editTexture', result[0]);
        } else {
            // Otherwise create new entry
            let len = texture.lastIndexOf('.');
            let no_ext = texture.substr(0, len);
            let title = no_ext;
            let sql = 'INSERT INTO ' + _table + ' SET ? ';
            let post = { title: title, texture: texture };
            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                let id = result.insertId;
                res.render('editTexture', {
                    texture,
                    title,
                    id
                });
                createThumb(texfolder, texture);
            });
        }

    });
  
});

function createThumb(folder,name){
  // create thumbnail
  sharp(folder + name)
  .resize(80, 80, {
    //kernel: sharp.kernel.nearest,
    fit: 'contain',
    position: 'center',
    background: { r: 255, g: 255, b: 255, alpha: 1.0 }
  })
  .toFile( thumbfolder + name)
  .then(() => {
    // output.png is a 200 pixels wide and 300 pixels high image
    // containing a nearest-neighbour scaled version
    // contained within the north-east corner of a semi-transparent white canvas
  });
}

router.get('/texexists/:name', (req, res) => {
    let name = req.params.name;
    fs.exists(texfolder + name, function (exists) {
        let uploadedFileName;
        if (exists) {
            uploadedFileName = "true";
        } else {
            uploadedFileName = "false";
        }
        res.send(uploadedFileName);

    });

});

router.post('/delete', checkAuthenticated, (req, res) => {
    // remove the model from the server
    let path = texfolder + req.body.texture;
    let thumbpath = thumbfolder + req.body.texture;
    // remove image
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
        //file removed
    })
    
    // remove thumb
    fs.unlink(thumbpath, (err) => {
        if (err) {
            console.error(err)
            return
        }
        //file removed
    })

    // remove coresponding database entry
    let sql = "DELETE FROM "+ _table +" WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/textures');
    });
    
});

router.get('/all', (req,res)=>{
    let sql = 'SELECT * FROM ' + _table;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});



module.exports = router;