var express = require('express');
var router = express.Router();

var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res, next) {
  console.log("here");
    res.render('signup', {
        title: 'wasdWithMe - Sign up!',
        layout: 'secondary',
        file: 'signup'
    });
});

var authenticationOptions = {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
};

var authentication = passport.authenticate('local', authenticationOptions);

router.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email    = req.body.email;
    var gender   = req.body.gender;
    var birthday = req.body.date_of_birth;
    var country  = req.body.country;
    var state    = req.body.state;
    var city     = req.body.city;

    console.log("username: " + username
        + " password: "+ password
        + " email: " + email
        + " gender: " + gender
        + " birthday: " + birthday
        + " country: " + country
        + " state: " + state
        + " city: " + city);

    var user = new User({
        username: username,
        display_name : username,
        password : password,
        email : email,
        gender : gender,
        birthday : birthday,
        location: {
            country : country,
            state : state,
            city : city
        },
    });

    User.register(user, password, function(err, user) {
        if (err) {
            //handle error
            console.log(err);
            console.log("registering error occurred");
            return;
        }
        authentication(req, res, function () {
            console.log("Authenticated successfully");
            res.redirect('/');
        });
    });
});

module.exports = router;
