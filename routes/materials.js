const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../utils/db.js');
const sharp = require('sharp');

const fs = require('fs');
const path = require('path');
const { Recoverable } = require('repl');

const texfolder = 'public/textures/';
const thumbfolder = 'public/thumbs/';
const _table = 'standard_mat';
const _fields = {
    title: 'New Material',
    color_hex: '#CCCCCC',
    opacity_value: 1,
    emissive_hex: '#000',
    roughness_value: 0.5,
    metalness_value: 0.5,
    diffuse_map: '',
    normal_map: '',
    normal_value: 1,
    bumb_map: '',
    bumb_value: 1,
    alpha_map: '',
    metalness_map: '',
    roughness_map: ''

}

const imagePath = path.join(path.resolve(__dirname, '..'), 'public/textures/');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, texfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

router.get('/', (req, res) => {
    let sql = 'SELECT * FROM ' + _table;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('materialList', { materials: result, title: 'Materials' });
    })

});

router.get('/edit/:id', checkAuthenticated, (req, res) => {

    let _id = req.params.id;
    if (_id != "new") {
        let sql = "SELECT * from " + _table + " WHERE ID ='" + _id + "'";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            res.render('editMaterial', result[0]);
        });
    } else {
        let defaults = _fields;
        defaults.id = 'new';
        res.render('editMaterial', defaults);
    }
});



router.post('/edit', checkAuthenticated, (req, res) => {
    console.log("adding material", req.body);
    if (req.body.id != 'new') {
        let sql = "UPDATE " + _table + " SET ? WHERE id = '" + req.body.id + "'";;
        let post = req.body;
        delete post.submit;
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/materials');
        });
    } else {
        let sql = 'INSERT INTO ' + _table + ' SET ?';
        let post = req.body;
        delete post.submit;
        delete post.id;
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/materials');
        });
    }
});


router.post('/delete', checkAuthenticated, (req, res) => {


    // remove coresponding database entry

    let sql = "DELETE FROM " + _table + " WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/materials');
    });

});


router.post('/thumb', async function(req, res) {
    var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
    var id = req.body.id;
    var img = Buffer.from(base64Data, 'base64');
    await sharp(img)
    .resize({ width:80, height:80})
    .toFile(thumbfolder + '/materials/' + id + '.png')
    res.send('done');
});

router.get('/all', (req, res) => {
    let sql = 'SELECT * FROM ' + _table;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })

});



module.exports = router;