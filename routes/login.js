const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../utils/db.js');


router.get('/', (req, res) => {
    res.render('login', { layout: 'loginregister.hbs', title: 'Login' });
});
/*router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log("login", username, password);
});*/



router.get('/register', (req, res) => {
    console.log("register");
    res.render('register', { layout: 'loginregister.hbs', title: 'Register' });
});

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //add user to database 
        let sql = 'INSERT INTO users SET ?';
        console.log('Got body:', req.body);
        let username = req.body.username;
        let email = req.body.email;
        let password = hashedPassword;
        let post = { username: username, email: email, password: password };
        console.log("posting", post);
        let query = db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.redirect('/');
        });
    } catch {
        res.render('/register', { layout: 'loginregister.hbs' });
    }
    console.log("register");
    // res.render('register',{layout: 'loginregister.hbs', title:'Register'});
});

module.exports = router;