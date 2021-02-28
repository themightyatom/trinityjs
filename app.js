if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config() 
  }

const express = require('express');
const hbs = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const db = require('./utils/db');




//PASSPORT
const passport = require('passport');
const initializePassport = require('./utils/passport');
initializePassport(
    passport
  )


//var routes = require('./routes/index');
const app = express();

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

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
app.use('/accessories', require('./routes/accessories'));
app.use('/categories', require('./routes/categories'));
app.use('/languages', require('./routes/languages'));
app.use('/materials', require('./routes/materials'));
app.use('/textures', require('./routes/textures'));



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
    successRedirect: '/models',
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




