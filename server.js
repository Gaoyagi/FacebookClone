// Initialize express app
const express = require('express')
const app = express()

require('dotenv').config();
var exphbs = require('express-handlebars');               //express-handlebars templating
const bodyParser = require('body-parser');                //body-parser for parsing requests
const expressValidator = require('express-validator');    //express-validator is a wrapper for validator.js whcih santizes  string inputs
var cookieParser = require('cookie-parser');              //cookie-parser lets you change and set cookies
const jwt = require('jsonwebtoken');                      //JWT auth for coookies
var flash = require('connect-flash');                     //FIX LATER


//custom middleware for checking authentication token, is checked on every route
var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
    console.log("invalid auth")
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    console.log("valid auth")
  }

  next();
};

//setting handlebars as templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//USING MIDDLEWARE
  //inilize and use body parser
app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());        //use express-validator, has to be put after body pareser initialization why?
app.use(cookieParser());            //has to be after express app is initialized?
app.use(checkAuth);                 //use our custom auth middle ware made earlier
app.use(express.static('public'));  //allows for use of ajax
app.use(flash());               //FIX LATER


// Choose a port to listen on
const port = 3000
app.listen(process.env.PORT ||port, () => console.log(`Example app listening on port ${port}!`))


//REQUIRED FILES
require('./data/fb-db');                    //db and mongoose setup
require('./controllers/posts.js')(app);     //routes for posts
require('./controllers/comments.js')(app);  //routes for comments
require('./controllers/auth.js')(app);      //routes for auth
require('./controllers/profiles.js')(app);  //routes for all profile info of the user   
