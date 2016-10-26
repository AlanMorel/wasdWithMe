var express = require('express');
var router = express.Router();

var Logger = require('../utility/logger');
var User  = require('../models/user');
var fs    = require('fs');

//handles GET requests to the root
router.get('/', function (req, res, next) {

    var games = ["Rocket League", "Rust", "Overwatch", "Destiny", "Dead by Daylight", "Minecraft", "World of Warcraft", "FIFA 16", "Call of Duty: Black Ops III", "Smite", "Grand Theft Auto V", "StarCraft II", "DayZ", "Battlefield 4", "RuneScape"];

    var query = {
        'one_up_count': -1
    };

    User.find().sort(query).limit(5).exec(function (err, users) {
        if (err){
            Logger.log("Searching for live user profiles failed.", err);
            return;
        }
        users = addTemporaryInfo(users);
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

//adds temporary information to users
function addTemporaryInfo(users) {
    var platforms = ["steam", "xbox", "playstation", "twitch"];
    for (var i = 0; i < users.length; i++) {
        users[i].platforms = platforms.sort(function () {return 0.5 - Math.random()}).slice(0, Math.floor(Math.random() * platforms.length) + 1);
        users[i].profile_pic = getProfilePic(users[i]);
    }
    return users;
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
