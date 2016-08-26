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
    var displayName = req.body.username;
    var username = displayName.toLowerCase(); //properly slug this
    var password = req.body.password;
    var email    = req.body.email;
    var gender   = req.body.gender;
    var birthday = req.body.date_of_birth;
    var country  = req.body.country;
    var state    = req.body.state;
    var city     = req.body.city;

    console.log("username: " + username
        + " display: " + displayName
        + " password: "+ password
        + " email: " + email
        + " gender: " + gender
        + " birthday: " + birthday
        + " country: " + country
        + " state: " + state
        + " city: " + city);

    var user = new User({
        username: username,
        display_name : displayName,
        password : password,
        email : email,
        gender : gender,
        birthday : birthday,
        location: {
            country : country,
            state : state,
            city : city
        },
        //Randomly give newly registered users 1-1000 one ups and 1-10 coins for testing purposes
        one_ups: getRandomOneUps(),
        coins: Math.floor(Math.random() * 10) + 1
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

function getRandomOneUps(){
    var oneUps = [];
    var oneUp = {
        oneUpper: "Testing"
    };
    var oneUpsRandom = Math.floor(Math.random() * 100) + 1;
    for (var i = 0; i < oneUpsRandom; i++) {
        oneUps.push(oneUp);
    }
    return oneUps;
}

module.exports = router;
