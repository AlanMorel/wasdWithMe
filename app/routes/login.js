var express = require('express');
var router = express.Router();

var passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'wasdWithMe - Log in!',
        layout: 'secondary',
        css: 'login'
    });
});

router.post('/', passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }), function(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        console.log("User logged in: "
            + "username: " + username
            + " password: "+ password);

        res.redirect('/');
    }
);

module.exports = router;
