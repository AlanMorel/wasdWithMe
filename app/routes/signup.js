var express = require('express');
var router = express.Router();

var passport = require('passport');
var User     = require('../models/user');
var config   = require('../config');

router.get('/', function (req, res, next) {
    res.render('signup', {
        title: 'wasdWithMe - Sign up!',
        layout: 'secondary',
        file: 'signup',
        error: req.session.msg
    });
    //reset session so no longer persists
    req.session.msg = undefined;
});

var authenticationOptions = {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
};

var authentication = passport.authenticate('local', authenticationOptions);

router.post('/', function (req, res) {
    var displayName = req.body.username;
    var username = displayName.toLowerCase(); //properly slug this
    var password = req.body.password;
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

    if (!checkAccount(displayName, password, email, req)) {
        return res.redirect('/signup');
    }

    var oneUps = getRandomOneUps(100);
    var oneUpCount = oneUps.length;

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
        //Randomly give newly registered users 1-100 one ups and 1-10 coins for testing purposes
        one_ups: oneUps,
        one_up_count: oneUpCount,
        coins: getRandomCoins(10)
    });

    User.register(user, password, function (err, user) {
        if (err) {
            //handle error
            console.log(err);
            console.log("registering error occurred");
            req.session.msg = err.message;
            return res.redirect('/signup');
        }
        authentication(req, res, function () {
            console.log("Authenticated successfully");
            return res.redirect('/');
        });
    });
});

function getRandomOneUps(number) {
    var oneUps = [];
    var oneUp = {
        oneUpper: "Testing"
    };
    var oneUpsRandom = Math.floor(Math.random() * number) + 1;
    for (var i = 0; i < oneUpsRandom; i++) {
        oneUps.push(oneUp);
    }
    return oneUps;
}

function getRandomCoins(number) {
    return Math.floor(Math.random() * number) + 1
}

//Every function below this comment belongs in separate validation.js file

//checkAccount should instead return string with error
//no error returns empty string
//if checkAccount, then set it
function checkAccount(username, password, email, req) {

    if (username === '') {
        req.session.msg = "No username inputted";
        return false;
    }
    //check username first
    if (!usernameIsValid(username)) {
        req.session.msg = "Only alphanumerical, numerical, dashes and underscores allowed in username";
        return false;
    }

    if (username.length < config.usernameMinLength || username.length > config.usernameMaxLength) {
        req.session.msg = "Username must be between " + config.usernameMinLength+ " and " + config.usernameMaxLength + " characters in length";
        return false;
    }

    //check password field valid next
    if (password === '') {
        req.session.msg = "You must input a password";
        return false;
    }

    if (password.length < config.passwordMinLength || password.length > config.passwordMaxLength) {
        req.session.msg = "Passwords must be between " + config.passwordMinLength + " and " + config.passwordMaxLength + " characters in length";
        return false;
    }

    //check email field if valid
    if (email === '') {
        req.session.msg = "Email address not entered";
        return false;
    }

    if (!emailIsValid(email)) {
        req.session.msg = "Email address entered not valid";
        return false;
    }

    return true;
}
/*
 Regex operation ensures first character is an alphanumeric
 */
function usernameIsValid(username) {
    return /^[a-zA-z][0-9a-zA-Z_-]+$/.test(username);
}

function emailIsValid(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

module.exports = router;
