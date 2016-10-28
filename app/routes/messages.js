var express = require('express');
var router = express.Router();

var Logger = require('../utility/logger');
var User   = require('../models/user');

//handles get request for all messages
router.get('/', function (req, res, next) {

    //display all messages here

    res.render('message', {
        title: 'All Messages',
        layout: 'primary',
        file: 'message',
        user: req.user,
        js: ["/socket.io/socket.io", "/javascript/messages"]
    });
});

//handles GET requests to /message/username
router.get('/:username', function (req, res, next) {

    var username = req.params.username.toLowerCase();

    User.findByUsername(username, true, function(err, owner) {

        //if error or user not found, return userNotFound
        if (err || !owner){
            return userNotFound(res, req.user, username);
        }

        //addTemporaryInfo(owner);

        res.render('message', {
            title: 'Messages with ' + username,
            layout: 'primary',
            file: 'message',
            user: req.user,
            js: ["/socket.io/socket.io", "/javascript/messages"],
            to: username
        });
    });
});

//renders 404 page whenever a user was not found
function userNotFound(res, user, username){
    res.status(404);
    res.render('404', {
        title: 'User not found!',
        layout: 'primary',
        file: '404',
        user: user,
        message: "We could not find any user named '" + username + "'."
    });
}

module.exports = router;
