var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function (req, res, next) {
    var database = true; //true loads users from database, false uses preset users below

    if (!database) {
        loadPresetUsers(req, res);
        return;
    }

    User.find().sort({'one_up_count': -1}).limit(5).exec(function (err, users) {
        users = addPlatforms(users);
        res.render('homepage', {
            title: 'wasdWithMe - Connect with gamers.',
            layout: 'primary',
            file: 'homepage',
            user: req.user,
            live_profile_users: users
        });
    });
});

function loadPresetUsers(req, res) {
     var users = [{
        display_name: "SharpAceX",
        one_up_count: 186,
    }, {
        display_name: "Alan",
        one_up_count: 153,
    }, {
        display_name: "JohnCena",
        one_up_count: 135,
    }, {
        display_name: "Edgar",
        one_up_count: 89,
    }, {
        display_name: "Anteneh",
        one_up_count: 64,
    }];
    users = addPlatforms(users);
    res.render('homepage', {
        title: 'wasdWithMe - Connect with gamers.',
        layout: 'primary',
        file: 'homepage',
        user: req.user,
        live_profile_users: users
    });
}

function addPlatforms(users) {
    var allPlatforms = ["Steam", "Xbox", "Playstation", "Twitch"];
    for (var i = 0; i < users.length; i++) {
        //I won't even bother commenting this mess, it is only temporary
        users[i].platforms = allPlatforms.sort(function () {
            return 0.5 - Math.random()
        }).slice(0, Math.floor(Math.random() * allPlatforms.length) + 1);
    }
    return users;
}

module.exports = router;
