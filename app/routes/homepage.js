var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function(req, res, next) {
    var database = true; //true loads users from database, false uses preset users below

    if (database){
        User.find().sort({'one_up_count': -1}).limit(5).exec(function(err, users) {
            users = addPlatforms(users);
            res.render('homepage', {
                title: 'wasdWithMe - Connect with gamers.',
                layout: 'primary',
                file: 'homepage',
                user: req.user,
                live_profile_users: users
            });
        });
    } else {
        var users = getPresetUsers();
        users = addPlatforms(users);
        res.render('homepage', {
            title: 'wasdWithMe - Connect with gamers.',
            layout: 'primary',
            file: 'homepage',
            user: req.user,
            live_profile_users: users
        });
    }
});

function addPlatforms(users){
    var allPlatforms = ["Steam", "Xbox", "Playstation", "Twitch"];
    for (var i = 0; i < users.length; i++) {
        //I won't even bother commenting this mess, it is only temporary
        users[i].platforms = allPlatforms.sort( function() { return 0.5 - Math.random() }).slice(0, Math.floor(Math.random() * allPlatforms.length) + 1);
    }
    return users;
}

function getPresetUsers() {
    var users = [{
        display_name: "SharpAceX",
        oneUps: 186,
    }, {
        display_name: "Alan",
        oneUps: 153,
    }, {
        display_name: "JohnCena",
        oneUps: 135,
    }, {
        display_name: "Edgar",
        oneUps: 89,
    }, {
        display_name: "Anteneh",
        oneUps: 64,
    }];
    return users;
}

module.exports = router;
