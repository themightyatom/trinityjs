const express = require('express');
const router = express.Router();

const db = require('../utils/db.js');

 router.get('/', (req,res) =>{
    res.render('dashboard');
 });


module.exports = router;