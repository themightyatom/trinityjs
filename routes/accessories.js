const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');


router.post('/edit', checkAuthenticated, (req, res) => {
    // if id is new, create a new entry, otherwise update
    console.log('INCOMING', req.body);
    if (req.body.id != 'new') {
        let sql = "UPDATE accessories SET ? WHERE id = '" + req.body.id + "'";
        let list;
        if(Array.isArray(req.body.list)){
            list = req.body.list.join('|');
        }else{
            list = req.body.list;
        }
        console.log("new list", list);
        let post = { title: req.body.title, type: req.body.type, list: list };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/accessories');
        });
    } else {
        let sql = 'INSERT INTO accessories SET ?';
        let title = req.body.title;
        let list;
        if(Array.isArray(req.body.list)){
            list = req.body.list.join('|');
        }else{
            list = req.body.list;
        }
        console.log("new list", list);
        let type = req.body.type;
        let post = { title: title, list: list, type: type };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;

            let sql = 'SELECT * FROM accessories';
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                res.redirect('/accessories');
            });

        });
    }
});


router.get('/', checkAuthenticated, (req, res) => {
    let sql = 'SELECT * FROM accessories';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('accessoryList', { accessories: result, title: 'Accessory Groups' });
    })
});

router.get('/edit/:id', checkAuthenticated, (req, res) => {

    if (req.params.id != 'new') {
        let _id = req.params.id;
        let sql = "SELECT * from accessories WHERE ID ='" + _id + "'";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('editAccessory', result[0]);
        });
    } else {
        res.render('editAccessory', {id:'new'});
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {

    // remove coresponding database entry
    let sql = "DELETE FROM accessories WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/accessories');
    });

});

module.exports = router;