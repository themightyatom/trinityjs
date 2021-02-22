const express = require('express');
const router = express.Router();

const db = require('../utils/db.js');


router.get('/', (req, res) =>{
    console.log("login");
    res.render('login',{layout: 'loginregister.hbs', title:'Login'});

});
router.post('/user-login', (req,res) =>{
    let username = req.body.username;
    let password = req.body.password;
    console.log("login", username, password);
});

router.get('/register', (req,res) =>{
    console.log("register");
    res.render('register',{layout: 'loginregister.hbs', title:'Register'});
});

module.exports = router;