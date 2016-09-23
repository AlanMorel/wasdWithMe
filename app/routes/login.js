var express = require('express');
var router = express.Router();

var passport = require('passport');

//handles GET requests to /login
router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'Log in',
        layout: 'secondary',
        file: 'login'
    });
});

var authenticationOptions = {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
};

var authentication = passport.authenticate('local', authenticationOptions);

//logs users in
router.post('/', authentication, function(req, res) {});

module.exports = router;
