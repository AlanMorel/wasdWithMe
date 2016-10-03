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

//handles a login attempt
router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err  || !user) {
            res.render('login', {
                title: 'Log In',
                layout: 'secondary',
                file: 'login',
                error: "The username or password is not correct."
            });
            return;
        }
        req.login(user, function(err){
            if(err){
                res.render('login', {
                    title: 'Log In',
                    layout: 'secondary',
                    file: 'login',
                    error: "An internal error has occurred."
                });
                return;
            }
            //User logged in successfully, redirect to homepage
            return res.redirect("/");
        });
    })(req, res, next);
});

module.exports = router;
