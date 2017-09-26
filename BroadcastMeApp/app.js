var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var compressor = require('node-minify');

var configDB = require('./config/database.js');

var app = express();

//some extra commit

mongoose.connect(configDB.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'broadcastmesecret' }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());

require('./config/passport.js')(passport);
require('./routes/routes.js')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

compressor.minify({
	compressor: 'uglifyjs',
	input: ['./public/javascripts/jquery-3.2.1.min.js', './public/javascripts/jquery-ui.min.js', './public/javascripts/userSearch.js'],
	output: './public/compiled-js/common.js',
	callback: function (err, min) {}
});

compressor.minify({
	compressor: 'uglifyjs',
	input: ['./public/compiled-js/common.js', './public/javascripts/userWall.js'],
	output: './public/compiled-js/wallPage.js',
	callback: function (err, min) {}
});

compressor.minify({
	compressor: 'uglifyjs',
	input: ['./public/compiled-js/common.js', './public/javascripts/userProfile.js'],
	output: './public/compiled-js/profilePage.js',
	callback: function (err, min) {}
});

compressor.minify({
	  compressor: 'clean-css',
	  input: ['./public/stylesheets/bootstrap/bootstrap-grid.min.css', './public/stylesheets/bootstrap/bootstrap.min.css', './public/stylesheets/style.css'],
	  output: './public/compiled-css/common.min.css',
	  callback: function (err, min) {}
	});