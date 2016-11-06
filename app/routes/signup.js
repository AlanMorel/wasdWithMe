var router = require('express').Router();

var passport   = require('passport');
var User       = require('../models/user');
var config     = require('../config');
var Validation = require('../utility/validation');
var Logger     = require('../utility/logger');

//renders the signup page when users visit /signup/
router.get('/', function (req, res, next) {
    res.render('signup', {
        title: 'Sign Up',
        layout: 'secondary',
        file: 'signup',
        js: ['validation', 'signup', 'location']
    });
});

var authenticationOptions = {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
};

var authentication = passport.authenticate('local', authenticationOptions);

router.post('/', function (req, res) {
    var displayName = req.body.username;
    var username = displayName.toLowerCase();
    var password = req.body.password;
    var confirmation = req.body.confirmation;
    var email = req.body.email;
    var gender = req.body.gender;
    var birthday = req.body.date_of_birth;
    var country = req.body.country;
    var state = req.body.state;
    var city = req.body.city;

    console.log("username: " + username
        + " display: " + displayName
        + " password: " + password
        + " email: " + email
        + " gender: " + gender
        + " birthday: " + birthday
        + " country: " + country
        + " state: " + state
        + " city: " + city);

    var error = Validation.checkAccount(displayName, password, confirmation, email);

    //Any errors are displayed to the user, otherwise continue signing them up
    if (error != undefined) {
        res.render('signup', {
            title: 'Sign Up',
            layout: 'secondary',
            file: 'signup',
            error: error,
            js: ['validation', 'signup', 'location']
        });
        return;
    }

    var user = new User({
        username: username,
        display_name: displayName,
        password: password,
        email: email,
        gender: gender,
        birthday: birthday,
        location: {
            country: country,
            state: state,
            city: city
        },
        coins: getRandomCoins(10)
    });

    User.register(user, password, function (err, user) {
        if (err) {
            if(err.name === 'UserExistsError'){
                res.render('signup', {
                    title: 'Sign Up',
                    layout: 'secondary',
                    file: 'signup',
                    error: "Sorry, a user with this username already exists.",
                    js: ['validation', 'signup', 'location']
                });
            } else {
                Logger.log("Registering user failed.", err);
            }
            return;
        }
        authentication(req, res, function () {
            return res.redirect('/');
        });
    });
});

function getRandomCoins(number) {
    return Math.floor(Math.random() * number) + 1
}

module.exports = router;
