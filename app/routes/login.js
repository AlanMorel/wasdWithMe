var router = require('express').Router();

var passport = require('passport');
var Logger   = require('../utility/logger');

//handles GET requests to /login
router.get('/', function(req, res, next) {
    res.render('login', getLoginOptions());
});

//handles a login attempt
router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {

        //if there is an error or user not found
        if (err || !user) {
            res.render('login', getLoginOptions("The username or password is not correct."));
            return;
        }

        //otherwise attempt login
        req.login(user, function(err){

            //if error occurred, let user know
            if(err){
                res.render('login', getLoginOptions("An error has occurred."));
                Logger.log("Login attempt by " + user.display_name + " failed.", err);
                return;
            }

            //user logged in successfully, redirect to homepage
            return res.redirect("/");
        });
    })(req, res, next);
});

//returns login page options with optional error message
function getLoginOptions(error){
    var options = {
        title: 'Log in',
        layout: 'secondary',
        file: 'login',
        js: ['validation', 'login']
    };
    if (error){
        options.error = error;
    }
    return options;
}

module.exports = router;
