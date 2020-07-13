// Initialize express app
const express = require('express')
const app = express()

var exphbs = require('express-handlebars');             //imports express-handlebars templating
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

//const methodOverride = require('method-override')




app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//USING MIDDLEWARE
  //inilize body parser
app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());    //use express-validator, has to be put after body pareser initialization why?


// Choose a port to listen on
const port = 3000
app.listen(process.env.PORT ||port, () => console.log(`Example app listening on port ${port}!`))


//REQUIRED FILES
require('./data/fb-db');                    //db and mongoose setup
require('./controllers/posts.js')(app);     //routes for posts
require('./controllers/comments.js')(app);  //routes for comments
