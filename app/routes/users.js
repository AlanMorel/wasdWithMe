var express = require('express');
var router = express.Router();

var mongoose                = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose   = require('passport-local-mongoose');
var passport                = require('passport');
var LocalStrategy           = require('passport-local').Strategy;
var flash                   = require('connect-flash');
//var db = require('db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',function(req,res){
  res.render('login.hbs', {message: req.flash('Login')});
});

router.post('/login', passport.authenticate('local', { layout:'',
                                                       successRedirect: '/',
                                                       failureRedirect: '/login?failure=true',
                                                       failureFlash: "login failed!",
                                                       successFlash: "login successful!"}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/signup',function(req,res){
  res.render('signup.hbs', {message: req.flash('Signup')});
});

module.exports = router;
