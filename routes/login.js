const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../utils/db.js');


router.get('/', (req, res) => {
    res.render('login', { layout: 'loginregister.hbs', title: 'Login' });
});




router.get('/register', checkAuthenticated, (req, res) => {
    // check role 
    let user = req.user
    .then((response) =>{
       if(response.role == "admin") res.render('register', { layout: 'loginregister.hbs', title: 'Register' });;
       if(response.role == "merchant")res.redirect('/users');
    })
   
});

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })

router.post('/register', checkAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //add user to database 
        let sql = 'INSERT INTO users SET ?';
        let username = req.body.username;
        let email = req.body.email;
        let role = req.body.role;
        let password = hashedPassword;
        let post = { username: username, email: email, password: password, role:role, merchant_id:req.body.merchant_id };
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/');
        });
    } catch {
        res.render('/register', { layout: 'loginregister.hbs' });
    }
    // res.render('register',{layout: 'loginregister.hbs', title:'Register'});
});

module.exports = router;