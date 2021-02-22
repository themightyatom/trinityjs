const express = require('express');
const hbs = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

//var routes = require('./routes/index');
const app = express();

// deliver previously cached page version
const cache = false;
// view engine setup
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));



const PORT = process.env.PORT || 3000;

app.use('/models', require('./routes/models'));
app.use('/users', require('./routes/users'));
app.use('/login', require('./routes/login'));

app.listen( PORT,() =>{
    console.log(`Server started, port ${PORT}`);
});

app.use(express.static(path.join(__dirname, '/public')));
