const express = require('express');
const mysql = require('mysql');

const app = express();

app.set('port', process.env.PORT || 8080);


/*const db = mysql.createConnection({
    host: 'localhost',
    user: 'customsh_ltvs',
    password: '(z&ibgw^=NfP',
    database: 'customsh_node'
});

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('MySQL Connected...');
});*/

app.get('/createtable', (req,res) =>{
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send ('Posts table created');
    })
});

app.get('/addpost/:title', (req,res) =>{
    let title = req.params.title;
    let post = {title: title, body:'Post one body'};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err,result)  => {
        if(err) throw err;
        console.log(result);
        res.send ('Post added');
    })
});

app.get('/getposts' , (req,res) =>{
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql,(err,result)  => {
        if(err) throw err;
        console.log(result);
        res.send (result);
    })
});

app.get('/hello' , (req,res) =>{
    res.send("world");
});



app.get('/', function(req, res) {
    res.send("Hello World!");
});



/*app.listen('8080',() =>{
    console.log("Server started");

});*/
app.listen(app.get('port'));