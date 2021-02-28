const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');


router.post('/edit', checkAuthenticated, (req, res) => {
    // if id is new, create a new entry, otherwise update
    if (req.body.id != 'new') {
        let sql = "UPDATE languages SET ? WHERE id = '" + req.body.id + "'";
        let post = { title: req.body.title, stub: req.body.stub };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/languages');
        });

    } else {
        let sql = 'INSERT INTO languages SET ?';
        let title = req.body.title;
        let post = { title: title, stub: req.body.stub };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            // Add field to models
            console.log("ADDING COLUMN" + req.body.stub)
            sql = 'ALTER TABLE Categories ADD ' + req.body.stub + ' varchar(255)';
            query = db.query(sql, (err, result) => {
                if (err) throw err;
                sql = 'UPDATE Categories SET ' + req.body.stub + ' = title';
                query = db.query(sql, (err, result) => {
                    if (err) throw err;
                    res.redirect('/languages');
                });
                
            });
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
        sql = 'ALTER TABLE Categories DROP COLUMN ' + req.body.stub;
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