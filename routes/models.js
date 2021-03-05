const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const db = require('../utils/db.js');
const pp = require('../utils/passport.js');
//const pp = require('../utils/controller.js');


const glbfolder = 'public/glb/';
const thumbfolder = 'public/thumbs/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, glbfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

/*
router.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE models(id int AUTO_INCREMENT, title VARCHAR(255), sku VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log();
        res.send('Posts table created');
    })

});
*/


router.post('/addNewModel', (req, res) => {
    let sql = 'INSERT INTO models SET ?';
    console.log('Got body:', req.body);
    let title = req.body.title;
    let sku = req.body.sku;
    let model = req.body.model;
    let post = { title: title, sku: sku, model: model };
    console.log("posting", post);
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;

        let sql = 'SELECT * FROM models';
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.render('list', { models: result, title: 'all posts' });
        });

    });
});

router.get('/all', (req,res) => {
    let sql = 'SELECT * FROM models';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send( result );
    })
});



router.get('/search/:term', (req,res) =>{
    //let sql = 'SELECT * FROM models WHERE title LIKE ' + req.params.term;
    let sql = "SELECT title, id FROM models WHERE title LIKE '%" + req.params.term + "%' OR sku LIKE '%" + req.params.term + "%'";
    console.log(sql);
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send( result );
    })
});


router.get('/', checkAuthenticated, (req, res) => {
    let sql = 'SELECT * FROM models';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('modelList', { models: result, title: 'Models' });
    })
});

router.get('/editModel/:id', checkAuthenticated, (req, res) => {
    let _id = req.params.id;
    let sql = "SELECT * from models WHERE ID ='" + _id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('editModel', result[0]);
    });
});




router.get('/uploadModel', checkAuthenticated, (req, res) => {
    res.render('itemupload', { title: 'UPLOAD NEW MODEL' });
});

// It's very crucial that the file name matches the name attribute in your html
router.post('/uploadglb/', upload.single('file-to-upload'), (req, res) => {
    let model = req.file.originalname;
    // Check for database entry with same file name
    let sql = "SELECT * from models WHERE model ='" + model + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result.length);
        if (result.length > 0) {
            let id = result[0].id;
            res.render('editModel', result[0]);
        } else {
            // Otherwise create new entry
            let len = model.lastIndexOf('.');
            let sku = model.substr(0, len);
            let title = sku;
            let sql = 'INSERT INTO models SET ? ';
            let post = { title: title, sku: sku, model: model };
            console.log("posting", post);
            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                let id = result.insertId;
                res.render('editModel', {
                    model,
                    title,
                    sku,
                    id
                });
            });
        }

    });

});


router.get('/glbexists/:name', (req, res) => {
    let name = req.params.name;
    fs.exists(glbfolder + name, function (exists) {
        let uploadedFileName;
        if (exists) {
            uploadedFileName = "true";
        } else {
            uploadedFileName = "false";
        }
        res.send(uploadedFileName);

    });

});

router.post('/updatemodel', checkAuthenticated,(req, res) => {
    console.log(req.body);
    let cats = JSON.stringify(req.body.categories);
    let groups = JSON.stringify(req.body.accessory_groups);
    req.body.categories = cats;
    req.body.accessory_groups = groups;
    delete req.body.submit;
    /*    if(Array.isArray(req.body.categories)){
            cats = req.body.categories.join('|');
        }else{
            cats = req.body.categories;
        }*/
    let sql = "UPDATE models SET ? WHERE id = '" + req.body.id + "'";
    let post = req.body;
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        res.redirect('/models');
    });

})
router.post('/deletemodel', checkAuthenticated, (req, res) => {
    // remove the model from the server
    const path = glbfolder + req.body.model;

    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }

        //file removed
    })
    // remove coresponding database entry
    console.log('delete', req.body);
    let sql = "DELETE FROM models WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/models');
    });
    
});

// PUBLIC INTERFACE

router.get('/:id', (req,res) => {
    let _id = req.params.id;
    let sql = "SELECT * from models WHERE ID ='" + _id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if(result.length >0){
        res.send( result[0] );
        }else{
            res.send({message:'No model found with that id'});
        }
    })
});

router.post('/thumb', function(req, res) {
    var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
    var id = req.body.id;
    fs.writeFile(thumbfolder + '/models/' + id + '.png', base64Data, 'base64', function(err) {
        if(err){
           console.log(err);
           
         }else{
            res.send("done");
         }
    });
});

module.exports = router;