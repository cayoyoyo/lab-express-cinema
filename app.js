// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/movies";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Movie = require("./models/Movie.model");


// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'Cinema Ironhack';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${projectName}`;

// 👇 Start handling routes here
app.get('/', (req, res) => {
    res.render('index');
});



app.get('/movies', (req, res, next) => {
 Movie.find()
 .then((result) => {
  res.render("movies", { movies : result });
 })
 .catch(()=> console.log("Error"));


});
 
 
app.get('/movies/:id', (req, res, next) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then((movie) => {
      res.render('movie', { movie: movie });
    })
    .catch((error) => {
      console.error('Error fetching movie:', error);
      res.redirect('/movies');
    });
});




const index = require('./routes/index');
app.use('/', index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
