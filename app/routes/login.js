var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'wasdWithMe - Log in!',
        layout: 'secondary',
        css: 'login'
    });
});

router.post('/', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    console.log("User logged in: "
        + "username: " + username
        + " password: "+ password);

    res.end("log in successful!");
});

module.exports = router;
