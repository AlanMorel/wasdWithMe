var express = require('express');
var router = express.Router();

var passport = require('passport');
var Logger   = require('../utility/logger');

//handles GET requests to /login
router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'Log in',
        layout: 'secondary',
        file: 'login',
        js: ['validation', 'login']
    });
});

//handles a login attempt
router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {

        //if there is an error or user not found
        if (err || !user) {
            res.render('login', {
                title: 'Log In',
                layout: 'secondary',
                file: 'login',
                js: ['validation', 'login'],
                error: "The username or password is not correct."
            });
            return;
        }

        //otherwise attempt login
        req.login(user, function(err){

            //if error occurred, let user know
            if(err){
                res.render('login', {
                    title: 'Log In',
                    layout: 'secondary',
                    file: 'login',
                    js: ['validation', 'login'],
                    error: "An error has occurred."
                });
                Logger.log("Login attempt by " + user.display_name + " failed.", err);
                return;
            }

            //user logged in successfully, redirect to homepage
            return res.redirect("/");
        });
    })(req, res, next);
});

module.exports = router;
