var express      = require('express');
var config       = require('./config');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash        = require('connect-flash');
var mongoose     = require('mongoose');
var passport     = require('passport');
var Strategy     = require('passport-local').Strategy;
var hbs          = require('hbs');
var stylus       = require('express-stylus');

//Pages
var homepage     = require('./routes/homepage');
var signUp       = require('./routes/signup');
var login        = require('./routes/login');
var logout       = require('./routes/logout');
var users        = require('./routes/users');

var app = express();

var public = path.join(__dirname, 'public');

//Express
app.use(favicon(path.join(public, 'favicon.ico')));
app.use(express.static(public));
app.use(logger('dev'));

//Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
hbs.registerHelper('config',function(variable) {
  return config[variable];
});

//BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//CookieParser
app.use(cookieParser());

//Passport
app.use(session({
  secret: config.passportSecret,
  resave: false,
  saveUninitialized: false,
  }
));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash
app.use(flash());

//Routes
app.use('/', homepage);
app.use('/signup', signUp);
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', users);

//MongoDB
mongoose.connect(config.mongooseUri);

//Stylus
app.use(stylus({
  src: path.join(public, "stylesheets")
}));

//404 error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//Production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
