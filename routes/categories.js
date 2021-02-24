const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');


router.post('/edit', checkAuthenticated, (req, res) => {
    // if id is new, create a new entry, otherwise update
    if (req.body.id != 'new') {
        let sql = "UPDATE categories SET ? WHERE id = '" + req.body.id + "'";
        let post = { title: req.body.title };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/categories');
        });
    } else {
        let sql = 'INSERT INTO categories SET ?';
        let title = req.body.title;
        let post = { title: title };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;

            let sql = 'SELECT * FROM categories';
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                res.redirect('/categories');
            });

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
            res.render('editCategory', result[0]);
        });
    } else {
        res.render('editCategory', {id:'new'});
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {

    // remove coresponding database entry
    let sql = "DELETE FROM categories WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/categories');
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