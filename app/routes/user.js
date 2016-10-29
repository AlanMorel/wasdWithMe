var router = require('express').Router();

var User   = require('../models/user');
var alert  = require('../utility/alert');
var config = require('../config');

//You should not be able to access /user/ directly
router.get('/', function(req, res, next) {
    return res.redirect("/");
});

//Returns back requested user
router.get('/:username', function(req, res, next) {
    var username = req.params.username;

    User.findByUsername(username.toLowerCase(), true, function(err, owner) {

        //if error or user not found, return userNotFound
        if (err || !owner){
            alert.send(req, res, 'User not found!', "We could not find any user named '" + username + "'.");
            return;
        }

        addTemporaryInfo(owner);

        res.render('user', {
            title: owner.display_name,
            layout: 'primary',
            file: 'user',
            user : req.user,
            owner: owner,
            gender: config.gender[owner.gender],
            age: getAge(owner.birthday),
            all_games: getGames(owner.games, false),
            fav_games: getGames(owner.games, true),
            is_owner: isOwner(req.user, owner)
        });
    });
});

//adds temporary information to the owner
function addTemporaryInfo(owner){
    owner.online_status = "online";

    owner.accounts.steam.steam_id = "Alan";
    owner.accounts.xbox.gamertag = "Alan";
    owner.accounts.playstation.psn_id = "Alan";
    owner.accounts.twitch.username = "Alan";
}

//returns list of game names, uris and favorite boolean
function getGames(list, fav){
    var games = [];
    for (var i = 0; i < list.length; i++) {
        if (fav){
            if (!list[i].favorite){
                continue;
            }
        }
        games.push({
            name: list[i].name,
            uri: encodeURI(list[i].name),
            favorite: list[i].favorite
        });
    }
    return games;
}

//returns true if user is on own page
function isOwner(user, owner){
    return user && user.username === owner.username;
}

//returns age of user in years
function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    return Math.floor(difference / year);
}

module.exports = router;
