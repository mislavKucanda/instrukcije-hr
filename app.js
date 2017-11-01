var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');

// Authentication Packages
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var index = require('./routes/index');
var api = require('./routes/api');
var User = require('./models/User');
var Const = require('./const');

var app = express();

var dbUrl = Const.dbUrl;
//var dbUrl = 'mongodb://localhost/myapp';
mongoose.connect(dbUrl, function(err, res) {
	if(err) {
		console.log('DB CONNECTION FAILED: ' + err);
	} else {
		console.log('DB CONNECTION SUCCESS.');
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: Const.secret,
  resave: false,     
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  // enable if you use https
  //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', index);
app.use('/api', api);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password.toString(), function(err, response) {
        if(response === true) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      }); 
    });
  }
));

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
