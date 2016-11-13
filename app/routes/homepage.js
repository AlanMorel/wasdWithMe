var router = require('express').Router();

var helper = require('../utility/helper');
var Logger = require('../utility/logger');
var User   = require('../models/user');

var games = ["Rocket League", "Rust", "Overwatch", "Destiny", "Dead by Daylight", "Minecraft", "World of Warcraft", "FIFA 16", "Call of Duty: Black Ops III", "Smite", "Grand Theft Auto V", "StarCraft II", "DayZ", "Battlefield 4", "RuneScape"];

//handles GET requests to the root
router.get('/', function (req, res, next) {

    var query = {
        'one_ups': -1
    };

    User.find().sort(query).limit(5).exec(function (err, users) {

        if (err || !users){
            Logger.log("Searching for live user profiles failed.", err);
        }

        users = addInfo(users, req.user);

        res.render('homepage', {
            title: 'WASD With Me - Connect with gamers.',
            layout: 'primary',
            file: 'homepage',
            user: req.user,
            popular_games: getGames(games).concat(getGames(games)),
            live_profile_users: users
        });
    });
});

//returns list of game names and uris
function getGames(list){
    var games = [];
    for (var i = 0; i < list.length; i++) {
        games.push({
            name: list[i],
            uri: encodeURI(list[i])
        });
    }
    return games;
}

//adds information to users
function addInfo(users, user) {
    for (var i = 0; i < users.length; i++) {
        var platforms = [];
        if (users[i].accounts.steam.steam_id){
            platforms.push("steam");
        }
        if (users[i].accounts.xbox.gamertag){
            platforms.push("xbox");
        }
        if(users[i].accounts.playstation.psn_id){
            platforms.push("playstation");
        }
        if(users[i].accounts.twitch.username){
            platforms.push("twitch");
        }
        users[i].platforms = platforms;
        users[i].oneUpped = helper.hasOneUpped(users[i].one_ups, user);
    }
    return users;
}

module.exports = router;
