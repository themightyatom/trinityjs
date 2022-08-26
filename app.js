if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() 
  }

const express = require('express');
const hbs = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const db = require('./utils/db');
const fs = require('fs');
//const key = fs.readFileSync('./https/key.pem');
//const cert = fs.readFileSync('./https/cert.pem');
//const https = require('https');




//PASSPORT
const passport = require('passport');
const initializePassport = require('./utils/passport');
initializePassport(
    passport
  )


//var routes = require('./routes/index');
const app = express();

//const server = https.createServer({key: key, cert: cert }, app);
//server.listen(5001, () => console.log(`HTTPS server listening: https://localhost`));

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json());

// deliver previously cached page version
const cache = false;
// view engine setup
const hbs_json = function(context) {
  return JSON.stringify(context);
};

app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs', helpers:require('./utils/handlebars-helpers')}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


var allowlist = ['https://lifetime2.unicaster.net', 'http://127.0.0.1:5500/','https://lifetimekidsrooms.dk/']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

//app.use(cors(corsOptionsDelegate)); //only certain domains
app.use(cors()); // all domians/debug
app.use(express.urlencoded({ extended: true, limit: '50mb'}));

const PORT = process.env.PORT || 3000;

app.use('/models', require('./routes/models'));
app.use('/users', require('./routes/users'));
app.use('/login', require('./routes/login'));
app.use('/accessories', require('./routes/accessories'));
app.use('/categories', require('./routes/categories'));
app.use('/languages', require('./routes/languages'));
app.use('/materials', require('./routes/materials'));
app.use('/textures', require('./routes/textures'));
app.use('/translations', require('./routes/translations'));
app.use('/clients', require('./routes/clients'));
app.use('/merchant', require('./routes/merchant'));
app.use('/outputedit', require('./routes/outputedit'));
app.use('/designs', require('./routes/designs'));
app.use('/ar', require('./routes/ar'));



global[checkAuthenticated] = (req, res, next) => {
  console.log("Checking");
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

global[checkNotAuthenticated] = (req, res, next) =>{
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

//pp.assignChecks(checkAuthenticated,checkNotAuthenticated);

/*app.post('/log-in', passport.authenticate('local', {
  successRedirect: '/models',
  failureRedirect: '/',
  failureFlash: true
}))*/

app.post('/log-in', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/',
    failureFlash: true
  }))


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.get('/', checkAuthenticated, (req,res) =>{
  //res.render('login', { layout: 'loginregister.hbs', title: 'Login' });
  res.redirect('/models');
});



app.listen( PORT,() =>{
    console.log(`Server started, port ${PORT}`);
});


app.use(express.static(path.join(__dirname, '/public')));




