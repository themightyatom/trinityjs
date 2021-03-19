const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const _table = "languages";


router.post('/edit', checkAuthenticated, (req, res) => {
    // if id is new, create a new entry, otherwise update
    if (req.body.id != 'new') {
        let sql = "UPDATE languages SET ? WHERE id = '" + req.body.id + "'";
        console.log("lang", req.body);
        let stub = req.body.stub;
        let orig = req.body.original_stub;
        let post = { title: req.body.title, stub: req.body.stub }; 
        //let post = { title: req.body.title };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            if(stub != orig){
            sql = "ALTER TABLE translations CHANGE "+ orig + " " + stub + " VARCHAR(12)";
               query = db.query(sql,(err,result) =>{
                    if(err) throw err;
                    res.redirect('/languages');
               });
            }else{
                res.redirect('/languages');
            }
            
        });

    } else {
        //first see if this language already exists. 
        //Otherwise it will cause error when adding to other tables
        let sql = "SELECT * FROM " + _table + " WHERE stub='" + req.body.stub + "'";
        let query = db.query(sql, (err,result) => {
            if (err) throw err;
            if(result.length > 0){
                res.render('error', {error:"Language code already in use"})
            }else{
                sql = 'INSERT INTO languages SET ?';
                let title = req.body.title;
                let post = { title: title, stub: req.body.stub };
                query = db.query(sql, post, (err, result) => {
                    if (err) {
                        res.render('error', err);
                    } else {
                        // Add field to Translations
                        console.log("ADDING COLUMN" + req.body.stub)
                        sql = 'ALTER TABLE translations ADD ' + req.body.stub + ' varchar(255)';
                        query = db.query(sql, (err, result) => {
                            if (err) throw err;
                                res.redirect('/languages');
                        });
                    }
                });
            }
        }); 
    }
});


router.get('/', checkAuthenticated, (req, res) => {
    let sql = 'SELECT * FROM languages';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('languageList', { languages: result, title: 'Languages' });
    })
});

router.get('/edit/:id', checkAuthenticated, (req, res) => {

    if (req.params.id != 'new') {
        let _id = req.params.id;
        let sql = "SELECT * from languages WHERE ID ='" + _id + "'";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('editLanguage', result[0]);
        });
    } else {
        res.render('editLanguage', { id: 'new' });
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {

    // remove coresponding database entry
    let sql = "DELETE FROM languages WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        sql = 'ALTER TABLE translations DROP COLUMN ' + req.body.stub;
        query = db.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/languages');
        });
    });


});

router.get('/all', checkAuthenticated, (req, res) => {
    let sql = 'SELECT * FROM languages';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

module.exports = router;