var express = require('express');
var router = express.Router();

var passport = require('passport');

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

router.post('/', authentication, function(req, res) {});

module.exports = router;
