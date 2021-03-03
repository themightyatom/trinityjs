
const mysql = require('mysql');


const db = mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.dbdatabase,
    socketPath: process.env.dbsocket
});

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('MySQL Connected...');
    console.log('http://localhost:3000/')
});

module.exports = db;