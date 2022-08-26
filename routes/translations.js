const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const _table ="translations";
const tt = require('../utils/translationTools');


router.post('/edit', checkAuthenticated, (req, res) => {
    let transltations = req.body;
    delete transltations.submit;
    tt.saveTranslations(req.body)
    .then(res.redirect('/' + req.body.item_type));
});


router.get('/', checkAuthenticated, (req, res) => {
    let sql = 'SELECT * FROM '+ _table;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('accessoryList', { accessories: result, title: 'Accessory Groups' });
    })
});

router.get('/edit/:type/:id/:title', checkAuthenticated, (req, res) => {
        
        let translations = {id:req.params.id};
        let params ={title:req.params.title, item_type:req.params.type, item_id:req.params.id }
        tt.getTranslations(translations, req.params.type)
        .then((response) => res.render('editTranslation', {params:params, languages:response}))
    
});


router.post('/delete', checkAuthenticated, (req, res) => {

    // remove coresponding database entry
    let sql = "DELETE FROM "+ _table +" WHERE item_id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/accessories');
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