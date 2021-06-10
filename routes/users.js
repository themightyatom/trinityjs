const express = require('express');
const router = express.Router();

const db = require('../utils/db.js');

 router.get('/', checkAuthenticated, (req,res) =>{
    let user = req.user
    .then((response) =>{
       if(response.role == "admin")res.render('dashboard');
       if(response.role == "merchant") res.render('dashboard',{ layout: 'merchant.hbs', title: 'Welcome ' + response.username });
    })
    
 });


module.exports = router;