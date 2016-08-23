var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("here");
    res.render('signup', {
        title: 'wasdWithMe - Sign up!',
        layout: 'secondary',
        css: 'signup'
    });
});

router.post('/', function(req, res){
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

    res.end("Sign up successful!");
});

module.exports = router;
