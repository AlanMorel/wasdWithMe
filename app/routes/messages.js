var express = require('express');
var router = express.Router();

var Logger  = require('../utility/logger');
var User    = require('../models/user');
var Message = require('../models/message');
var config  = require('../config');
var fs      = require('fs');

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

    if (!req.user){
        message(res, req.user, "Please log in.", "You must log in to message others.");
        return;
    }

    var username = req.params.username.toLowerCase();

    //to prevent people from trying to message themselves
    if (req.user.username === username){
        message(res, req.user, "You cannot message yourself.", "You cannot message yourself.");
        return;
    }

    //otherwise, find the person they're trying to message
    User.findByUsername(username, true, function(err, to) {

        //if error or user not found, return
        if (err || !to){
            message(res, req.user, "User not found!", "We could not find any user named'" + username + "'.");
            return;
        }

        //query to search for messages
        var query = {
            from: req.user.username.toLowerCase(),
            to: to.username
        };

        Message.find(query, function(err, messages) {

            if (err){
                Logger.log("Getting messages from " + req.user.username + " failed.", err);
                message(res, req.user, "Internal error!", "We could not find retrieve your messages.");
                return;
            }

            //set whether they are own or message from another person
            messages.forEach(function(message) {
                message.css = message.from === req.user.username ? "own" : "other";
            });

            res.render('message', {
                title: 'Messages with ' + username,
                layout: 'primary',
                file: 'message',
                user: req.user,
                js: ["/socket.io/socket.io", "/javascript/messages"],
                to: to,
                profile_pic: getProfilePic(to),
                gender: config.gender[to.gender],
                age: getAge(to.birthday),
                messages: messages
            });
        });
    });
});

//renders a page with a custom error message
function message(res, user, title, message){
    res.status(404);
    res.render('404', {
        title: title,
        layout: 'primary',
        file: '404',
        user: user,
        message: message
    });
}

//returns age of user in years
function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    return Math.floor(difference / year);
}

//returns profile pic of user if an image was uploaded, placeholder if none exists
function getProfilePic(owner){
    var path = "/images/profile/" + owner.display_name + ".png";
    try {
        fs.accessSync(path);
        return path;
    } catch (e) {

    }
    return "/images/placeholder.png";
}

module.exports = router;
