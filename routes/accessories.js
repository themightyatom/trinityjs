const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const _table = "accessories";
const translationTools = require('../utils/translationTools');


router.post('/edit', checkAuthenticated, (req, res) => {
    // all 'unknown' parameters are translations
    let translations = Object.assign({}, req.body);
    delete translations.submit;
    delete translations.title;
    delete translations.type;
    delete translations.id;
    delete translations.list;
    translations.item_id = req.body.id;
    translations.item_type = 'accessories';
    // if id is new, create a new entry, otherwise update
    if (req.body.id != 'new') {
        let sql = "UPDATE " + _table + " SET ? WHERE id = '" + req.body.id + "'";
        let list;
        list = JSON.stringify(req.body.list);

        let post = { title: req.body.title, type: req.body.type, list: list };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            // update translations
            translationTools.saveTranslations(translations)
                .then(res.redirect('/accessories'));

        });
    } else {
        let sql = 'INSERT INTO ' + _table + ' SET ?';
        let title = req.body.title;
        let list = JSON.stringify(req.body.list);
        let type = req.body.type;
        let post = { title: title, list: list, type: type };

        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            // insert translations!!!
            let _id = result.insertId;
            //use the newly created id
            translations.item_id = _id;
            // run insert
            translationTools.saveTranslations(translations)
                .then(res.redirect('/accessories'));

        });
    }
});

router.get('/clone/:id', checkAuthenticated, (req,res) =>{
    //copy parameters the original model, while creating new row
    let _id = req.params.id;
    let sql = "INSERT INTO " + _table +"( title, list, type, priority ) SELECT title, list, type, priority FROM "+ _table +" WHERE id=" + _id;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        translationTools.duplicateTranslations(_id ,result.insertId, 'accessories')
            .then((response) => {
                    //change name
                    let newid = result.insertId;
                    sql = "UPDATE " + _table +" SET title = CONCAT(title, ' (copy)') WHERE id =" + result.insertId;
                    query = db.query(sql, (err,result) => {
                    if (err) throw err;
                    res.redirect('/accessories/edit/' + newid );
                    });
                    
            });
    });
});


router.get('/', checkAuthenticated, (req, res) => {
   // let sql = 'SELECT * FROM ' + _table;
    let sql = "SELECT * FROM `accessories` ORDER BY `accessories`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('accessoryList', { accessories: result, title: 'Accessory Groups' });
    })
});

router.get('/edit/:id', checkAuthenticated, (req, res) => {

    if (req.params.id != 'new') {
        let _id = req.params.id;
        let sql = "SELECT * from " + _table + " WHERE ID ='" + _id + "'";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            var knownParameters = result[0];
            if(knownParameters.list != null && knownParameters.list.length > 1){
                let list = JSON.parse(knownParameters.list);
                knownParameters.list = list;
            }

           translationTools.getTranslations(knownParameters,'accessories')
           .then((response) => res.render('editAccessory', { params: knownParameters, languages: response }));

        });
    } else {
        let sql = "SELECT stub,title from languages";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            let params = { id: 'new', title: 'New Accessory Group' }
            res.render('editAccessory', { params: params, languages: result });
        });
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {

    // remove coresponding database entry
    let sql = "DELETE FROM " + _table + " WHERE id = '" + req.body.id + "'";
    //remove any associated translation
    let translations = {item_id:req.body.id, item_type:'accessories'};
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        translationTools.removeTranslations(translations)
            .then(res.redirect('/accessories'));
    });

});

router.get('/all', (req, res) => {
    let sql = "SELECT * FROM `accessories` ORDER BY `accessories`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
router.post('/reorder', (req,res) =>{
    let list = req.body.list;
        
          for(var i=0;i<list.length;i++) {
            var _id = list[i];
            var sql = "UPDATE accessories SET priority = ? WHERE id = ?";
            db.query(sql, [i, _id], function(err, result) {
              if(err) { console.log(err); return; }
            });
          };
  

    res.send('ok');


});

module.exports = router;