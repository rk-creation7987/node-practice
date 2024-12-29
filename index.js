const express = require('express')
const path = require('path')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express()
const port = 3000

// initilize the public static folder path
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
}));

// Middleware to make session messages available to views
app.use((req, res, next) => {
  // Pass session variables to views
  res.locals.success = req.session.success || false;
  res.locals.message = req.session.message || '';
  res.locals.error = req.session.error || false;
  res.locals.errorMessage = req.session.errorMessage || '';

  // Clear the session variables
  delete req.session.success;
  delete req.session.message;
  delete req.session.error;
  delete req.session.errorMessage;

  next();
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import route file
const myRoute = require(path.join(__dirname, 'route.js'));

// Use the imported route
app.use('/', myRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})