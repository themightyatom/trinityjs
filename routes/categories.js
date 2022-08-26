const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../utils/db.js');
const translationTools = require('../utils/translationTools');



const thumbfolder = 'public/thumbs/categories/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, glbfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });



const thumbstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, thumbfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

})

const uploadthumb = multer({
    storage:thumbstorage
  });


router.post('/edit', checkAuthenticated, (req, res) => {
    // all 'unknown' parameters are translations
    let translations = Object.assign({}, req.body);
    delete translations.submit;
    delete translations.title;
    delete translations.menu;
    delete translations.id;
    translations.item_id = req.body.id;
    translations.item_type = 'categories';
    // if id is new, create a new entry, otherwise update
    if (req.body.id != 'new') {
        let sql = "UPDATE categories SET ? WHERE id = '" + req.body.id + "'";
        let post = {title:req.body.title, menu:req.body.menu};
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            // update translations
            translationTools.saveTranslations(translations)
            .then(res.redirect('/categories'));
        });
    } else {
        let sql = 'INSERT INTO categories SET ?';
        let title = req.body.title;
        let menu = req.body.menu;
        if(menu == null) menu = 0; // zero values are not sent to server
        let post = {title:title, menu:menu};
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            let _id = result.insertId;
            //use the newly created id
            translations.item_id = _id;
            translationTools.saveTranslations(translations)
               .then(res.redirect('/categories'));
            
        });
    }
});


router.get('/', checkAuthenticated, (req, res) => {
    let sql = "SELECT * FROM `categories` ORDER BY `categories`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('categoryList', { categories: result, title: 'Categories' });
    })
});

router.get('/edit/:id', checkAuthenticated, (req, res) => {

    if (req.params.id != 'new') {
        let _id = req.params.id;
        let sql = "SELECT * from categories WHERE ID ='" + _id + "'";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            var knownParameters = result[0];
            translationTools.getTranslations(knownParameters,'categories')
            .then((response) => res.render('editCategory', { params: knownParameters, languages: response }));
        });
    } else {
        // make a field for each language
        let sql = "SELECT stub,title from languages";
        
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            var params = {id:'new', title:'New Category', menu:'1'};
            res.render('editCategory',  { params: params, languages: result });
        });
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {
 
    // remove coresponding database entry
    let sql = "DELETE FROM categories WHERE id = '" + req.body.id + "'";
    let translations = {item_id:req.body.id, item_type:'categories'};
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        translationTools.removeTranslations(translations)
            .then(res.redirect('/categories'));
    });

});

router.get('/all', checkAuthenticated, (req, res) => {
    let sql = "SELECT * FROM `categories` ORDER BY `categories`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

router.post('/reorder', (req,res) =>{
    let list = req.body.list;
        
          for(var i=0;i<list.length;i++) {
            var _id = list[i];
            var sql = "UPDATE categories SET priority = ? WHERE id = ?";
            db.query(sql, [i, _id], function(err, result) {
              if(err) { console.log(err); return; }
            });
          };
  

    res.send('ok');


});

router.post('/uploadthumb/', uploadthumb.single('file-to-upload'), (req, res) => {
    let modelid = req.body.modelid + '.png';
    let thumb = req.file;
    var file = path.join(thumbfolder, req.file.originalname);
    var updated = path.join(thumbfolder, modelid);
    fs.rename(file, updated, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("back")
        }

    })
});

module.exports = router;