var express = require('express');
var router = express.Router();

var Logger = require('../utility/logger');
var User   = require('../models/user');
var config = require('../config');

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

    User.findByUsername(username, true, function(err, user) {

        //if error or user not found, return userNotFound
        if (err || !user){
            return userNotFound(res, req.user, username);
        }

        //addTemporaryInfo(owner);

        res.render('message', {
            title: 'Messages with ' + username,
            layout: 'primary',
            file: 'message',
            user: req.user,
            js: ["/socket.io/socket.io", "/javascript/messages"],
            to: user,
            profile_pic: getProfilePic(user),
            gender: config.gender[user.gender],
            age: getAge(user.birthday)
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
