var express = require('express');
var router = express.Router();

var User   = require('../models/user');
var config = require('../config');
var fs     = require('fs');

//You should not be able to access /user/ directly
router.get('/', function(req, res, next) {
    return res.redirect("/");
});

//Returns back requested user
router.get('/:username', function(req, res, next) {
    var username = req.params.username;
    var usernameSlug = username.toLowerCase(); //properly slug it

    User.findByUsername(usernameSlug, true, function(err, owner) {

        if (err || !owner){
            userNotFound(res, req.user, username);
            return;
        }

        addTemporaryInfo(owner);

        res.render('user', {
            title: owner.display_name,
            layout: 'primary',
            file: 'user',
            user : req.user,
            owner: owner,
            profile_pic: getProfilePic(owner),
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

//returns profile pic of user if an image was uploaded, placeholder if none exists
function getProfilePic(owner){
    var path = "/images/profile/" + owner.display_name + ".png";
    try {
        fs.accessSync(path, fs.F_OK);
        return path;
    } catch (e) {
    }
    return "/images/placeholder.png";
}

//renders 404 page whenever a user was not found
function userNotFound(res, user, username){
    res.status(404);
    res.render('404', {
        title: 'User not found!',
        layout: 'primary',
        file: '404',
        user: user,
        message: username + " not found!"
    });
}

module.exports = router;
