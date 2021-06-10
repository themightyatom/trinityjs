const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const _table = "groups";
const translationTools = require('../utils/translationTools');


router.post('/edit', checkAuthenticated, (req, res) => {
    // all 'unknown' parameters are translations
    let translations = Object.assign({}, req.body);
    delete translations.submit;
    delete translations.title;
    delete translations.sku;
    delete translations.id;
    delete translations.members;
    translations.item_id = req.body.id;
    translations.item_type = 'group';
    // if id is new, create a new entry, otherwise update
    if (req.body.id != 'new') {
        let sql = "UPDATE " + _table + " SET ? WHERE id = '" + req.body.id + "'";
        let members;
        members = JSON.stringify(req.body.members);

        let post = { title: req.body.title, sku: req.body.sku, members: members };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            // update translations
            translationTools.saveTranslations(translations)
                .then(res.redirect('/groups'));

        });
    } else {
        let sql = 'INSERT INTO ' + _table + ' SET ?';
        let title = req.body.title;
        let members = JSON.stringify(req.body.members);
        let  sku = req.body.sku;
        let post = { 
            title,
            sku, 
            members
        };

        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            // insert translations!!!
            let _id = result.insertId;
            //use the newly created id
            translations.item_id = _id;
            // run insert
            translationTools.saveTranslations(translations)
                .then(res.redirect('/groups'));

        });
    }
});




router.get('/', checkAuthenticated, (req, res) => {
   // let sql = 'SELECT * FROM ' + _table;
    let sql = "SELECT * FROM " + _table ;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('groupList', { groups: result, title: 'Model Groups' });
    })
});

router.get('/edit/:id', checkAuthenticated, (req, res) => {

    if (req.params.id != 'new') {
        let _id = req.params.id;
        let sql = "SELECT * from " + _table + " WHERE ID ='" + _id + "'";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            var knownParameters = result[0];
            if(knownParameters.members != null && knownParameters.members.length > 1){
                let members = JSON.parse(knownParameters.members);
                knownParameters.members = members;
            }

           translationTools.getTranslations(knownParameters,'group')
           .then((response) => res.render('editGroup', { params: knownParameters, languages: response }));

        });
    } else {
        let sql = "SELECT stub,title from languages";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            let params = { id: 'new', title: 'New Model Group' }
            res.render('editGroup', { params: params, languages: result });
        });
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {

    // remove coresponding database entry
    let sql = "DELETE FROM " + _table + " WHERE id = '" + req.body.id + "'";
    console.log("REMOVING", req.body);
    //remove any associated translation
    let translations = {item_id:req.body.id, item_type:'group'};
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        translationTools.removeTranslations(translations)
            .then(res.redirect('/groups'));
    });

});

router.get('/all', (req, res) => {
    let sql = "SELECT * FROM " + _table;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


module.exports = router;