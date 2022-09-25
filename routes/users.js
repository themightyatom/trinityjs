const express = require('express');
const router = express.Router();

const db = require('../utils/db.js');

 router.get('/', checkAuthenticated, (req,res) =>{
    let user = req.user
    .then((response) =>{
       if(response.role == "admin")res.redirect('/models/page/0');
       // add other roles here
    })
    
 });


module.exports = router;