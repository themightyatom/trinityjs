const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const db = require('../utils/db.js');
const pp = require('../utils/passport.js');
//const pp = require('../utils/controller.js');
const translationTools = require('../utils/translationTools');
const sharp = require('sharp');


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


router.get('/all', (req, res) => {
    let sql = 'SELECT * FROM models';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});



router.get('/search/:term', (req, res) => {
    //let sql = 'SELECT * FROM models WHERE title LIKE ' + req.params.term;
    let sql = "SELECT title, id FROM models WHERE title LIKE '%" + req.params.term + "%' OR sku LIKE '%" + req.params.term + "%' ORDER BY `models`.`priority` ASC";
    console.log(sql);
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});


router.get('/', checkAuthenticated, (req, res) => {
    let sql = 'SELECT * FROM models ORDER BY `models`.`priority` ASC';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        sql = 'SELECT * FROM categories';
        query = db.query(sql, (err, cats) => {
            if (err) throw err;
            res.render('modelList', { models: result, categories: cats, title: 'Models' });
        })

    })
});
router.get('/category/:id', checkAuthenticated, (req, res) => {
    let searchstr = '\"' + req.params.id + '\"'; //search array as string
    let sql = "SELECT * FROM models WHERE categories LIKE '%" + searchstr + "%' ORDER BY `models`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        sql = 'SELECT * FROM categories';
        query = db.query(sql, (err, cats) => {
            if (err) throw err;
            res.render('modelList', { models: result, categories: cats, title: 'Models' });
        })
    })
});
router.post('/search/', checkAuthenticated, (req, res) => {
    let sql = "SELECT * FROM models WHERE title LIKE '%" + req.body.term + "%' OR sku LIKE '%" + req.body.term + "%' ORDER BY `models`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        sql = 'SELECT * FROM categories';
        query = db.query(sql, (err, cats) => {
            if (err) throw err;
            res.render('modelList', { models: result, categories: cats, title: 'Models' });
        })
    })
});


router.get('/editModel/:id', checkAuthenticated, (req, res) => {
    let _id = req.params.id;
    let sql = "SELECT * from models WHERE ID ='" + _id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        var knownParameters = result[0];
        // parse arrays
        if (knownParameters.accessory_groups.length > 1) {
            let groups = JSON.parse(knownParameters.accessory_groups);
            knownParameters.accessory_groups = groups;
        }
        if (knownParameters.materials.length > 1) {
            let mats = JSON.parse(knownParameters.materials);
            knownParameters.materials = mats;
        }
        if (knownParameters.categories.length > 1) {
            let cats = JSON.parse(knownParameters.categories);
            knownParameters.categories = cats;
        }
        translationTools.getTranslations(knownParameters, 'models')
            .then((response) => res.render('editModel', { params: knownParameters, languages: response }));

    });
});

//Create variation with same model
router.get('/variation/:id', checkAuthenticated, (req, res) => {
    //copy parameters the original model, while creating new row
    let _id = req.params.id;
    let sql = "INSERT INTO models( title, model, sku, categories, snap, snap_type, accessory_groups, materials, default_material, default_material_key ) SELECT title, model, sku, categories, snap, snap_type, accessory_groups, materials, default_material, default_material_key FROM models WHERE id=" + _id;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        translationTools.duplicateTranslations(_id ,result.insertId, 'models')
            .then((response) => {
                    res.redirect('/models/editmodel/' + result.insertId );
                
            });
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
                    params: {
                        model,
                        title,
                        sku,
                        id,
                        default_material:0
                    }
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

router.post('/updatemodel', checkAuthenticated, (req, res) => {
    //save any translations
    let translations = Object.assign({}, req.body);
    delete translations.submit;
    delete translations.categories;
    delete translations.accessory_groups;
    delete translations.id;
    delete translations.sku;
    delete translations.snap;
    delete translations.title;
    delete translations.model;
    delete translations.snap_type;
    delete translations.materials;
    delete translations.default_material;
    delete translations.default_material_key;
    translations.item_id = req.body.id;
    translations.item_type = 'models';

    console.log(req.body);
    let cats = JSON.stringify(req.body.categories);
    let groups = JSON.stringify(req.body.accessory_groups);
    let mats = JSON.stringify(req.body.materials);
    req.body.categories = cats;
    req.body.accessory_groups = groups;
    delete req.body.submit;
    let sql = "UPDATE models SET ? WHERE id = '" + req.body.id + "'";
    let post = { default_material: req.body.default_material, default_material_key: req.body.default_material_key, materials: mats, categories: cats, accessory_groups: groups, model: req.body.model, snap: req.body.snap, snap_type: req.body.snap_type, sku: req.body.sku, title: req.body.title };
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        // update translations
        translationTools.saveTranslations(translations)
            .then(res.redirect('/models'));
    });

})
router.post('/deletemodel', checkAuthenticated, (req, res) => {
    const path = glbfolder + req.body.model;
    const modname = req.body.model;
    // remove coresponding database entry
    console.log('delete', req.body);
    let sql = "DELETE FROM models WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
    });
    //check if model is in use in any other variations
    sql = "SELECT id,title FROM models WHERE model = '" + req.body.model + "'";
    query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            // remove the model from the server
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }

                //file removed
            })
            res.redirect('/models');
        }else{
            let variations = result;
            res.render('modelinuse', {model:modname, variations:variations});
        }
        
    });


});

// PUBLIC INTERFACE

router.get('/:id', (req, res) => {
    let _id = req.params.id;
    let sql = "SELECT * from models WHERE ID ='" + _id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.send({ message: 'No model found with that id' });
        }
    })
});

router.post('/thumb', async function (req, res) {
    var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
    var id = req.body.id;
    var img = Buffer.from(base64Data, 'base64');
    await sharp(img)
        .resize({ width: 80, height: 80 })
        .toFile(thumbfolder + '/models/' + id + '.png')
    res.send('done');
});

router.post('/reorder', (req,res) =>{
    let list = req.body.list;
    console.log("incoming", list);
    let ind = 0;
        
          for(var i=0;i<list.length;i++) {
            var _id = list[i];
            var sql = "UPDATE models SET priority = ? WHERE id = ?";
            db.query(sql, [i, _id], function(err, result) {
              if(err) { console.log(err); return; }
            });
          };
  

    res.send('ok');


});

module.exports = router;