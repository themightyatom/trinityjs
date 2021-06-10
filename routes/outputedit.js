const express = require('express');
const router = express.Router();
const fs = require('fs');


const db = require('../utils/db.js');
const pp = require('../utils/passport.js');
//const pp = require('../utils/controller.js');


router.get('/output', checkAuthenticated, (req, res) =>{
    let user = req.user
    .then((response) =>{
        res.render('codeedit', {layout: 'merchant.hbs', merchant: response.merchant_id, code:'cart'});
    });
    
});

router.get('/detector', checkAuthenticated, (req, res) =>{
    let user = req.user
    .then((response) =>{
        res.render('codeedit', {layout: 'merchant.hbs', merchant: response.merchant_id, code:'detect'});
    });
    
});

router.post('/savecode/:code', checkAuthenticated, (req, res) =>{
    let user = req.user
    .then((response) =>{
        let file = 'public/js/' + response.merchant_id + '/' + req.params.code + '.js';
        fs.writeFile(file, req.body.jscode, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            // success case, the file was saved
            res.render('codeedit', {layout: 'merchant.hbs', merchant: response.merchant_id, code:req.params.code, message:'Saved Succefully'});
        });
    });
});






module.exports = router;