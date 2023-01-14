const express = require("express");

const cors = require("cors");
var md5 = require("md5");
var corsOptions = {
  origin: '*' //"http://localhost:3000" 
};

const app = express();

var bodyParser = require('body-parser');
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());       // to support JSON-encoded bodies

// set up handlebars view engine
var handlebars = require('express3-handlebars')
 .create({ defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

require("./app/routes/tutorial.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/event.routes.js")(app);
require("./app/routes/attendee_data.routes.js")(app);

// POST /login gets urlencoded bodies
app.get('/login', function(req, res) {
  res.send('welcome, ');
});

// simple route
app.get("/", (req, res) => {
  //res.json({ message: "Welcome to earlypq application." });
  res.render('home');
});

app.get("/about", (req, res) => {
  res.render('about');
  //res.json({ message: "Welcome to earlypq about." });
});

app.get("/contact", (req, res) => {
  //res.json({ message: "Welcome to earlypq contact." });
  res.render('contact');
});

//view signin
app.get("/signin", (req, res) => {
  res.render('signin', { layout: 'auth' });
});

// processing signin
app.post('/signin', function(req, res){
  console.log('login attempt from ' + req.body.email +' <' + req.body.password + '>');
  try {
    // save to database....
    //return res.xhr ?
    res.render('thank-you', { message: "Welcome to earlypq application." });
    //res.redirect(303, '/thank-you');
  } catch(ex) {
    return res.xhr ?
      res.json({ error: 'Database error.' }) :
      res.redirect(303, '/database-error');
  }
});

// processing signin
app.post('/publicsignin', function(req, res){
  console.log('login attempt from ' + req.body.email +' <' + req.body.password + '>');
  try {
    // save to database....
    //return res.xhr ?
    res.render('thank-you', { message: "Welcome to earlypq application." });
    //res.redirect(303, '/thank-you');
  } catch(ex) {
    return res.xhr ?
      res.json({ error: 'Database error.' }) :
      res.redirect(303, '/database-error');
  }
}); 

app.get("/signup", (req, res) => {
  res.render('signup', { layout: 'auth' });
});

app.get("/thank-you", (req, res) => {
  res.render('thank-you', { layout: 'auth' });
});

app.get("/signout", (req, res) => {
  res.json({ message: "Welcome to earlypq signout." });
});

app.get("/profile", (req, res) => {
  res.json({ message: "Welcome to earlypq profile." });
});

app.get("/events", (req, res) => {
  res.json({ message: "Welcome to earlypq events." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});