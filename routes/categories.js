const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const translationTools = require('../utils/translationTools');


router.post('/edit', checkAuthenticated, (req, res) => {
    // all 'unknown' parameters are translations
    let translations = Object.assign({}, req.body);
    delete translations.submit;
    delete translations.title;
    delete translations.id;
    translations.item_id = req.body.id;
    translations.item_type = 'categories';
    // if id is new, create a new entry, otherwise update
    if (req.body.id != 'new') {
        let sql = "UPDATE categories SET ? WHERE id = '" + req.body.id + "'";
        let post = {title:req.body.title};
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            // update translations
            translationTools.saveTranslations(translations)
            .then(res.redirect('/categories'));
        });
    } else {
        let sql = 'INSERT INTO categories SET ?';
        let title = req.body.title;
        let post = {title:title};
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
    let sql = 'SELECT * FROM categories';
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
            var params = {id:'new', title:'New Category'};
            res.render('editCategory',  { params: params, languages: result });
        });
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {
    console.log("deleting",req.body);
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
    let sql = 'SELECT * FROM categories';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

module.exports = router;