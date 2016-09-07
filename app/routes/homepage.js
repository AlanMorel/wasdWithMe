var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function (req, res, next) {

    var games = ["Rocket League", "Rust", "Overwatch", "Destiny", "Dead by Daylight", "Minecraft", "World of Warcraft", "FIFA 16", "Call of Duty: Black Ops III", "Smite", "Grand Theft Auto V", "StarCraft II", "DayZ", "Battlefield 4", "RuneScape"];

    var query = {
        'one_up_count': -1
    };

    User.find().sort(query).limit(5).exec(function (err, users) {
        users = addStaticInfo(users);
        res.render('homepage', {
            title: 'wasdWithMe - Connect with gamers.',
            layout: 'primary',
            file: 'homepage',
            user: req.user,
            popular_games: getGames(games).concat(getGames(games)),
            live_profile_users: users
        });
    });
});

function getGames(games_list){
    var games = [];

    for (var i = 0; i < games_list.length; i++) {
        var name = games_list[i];
        var boxart = encodeURI(name);
        var slug = name.replace(/ /g, '').replace(/:/g, '');
        var game = {
            name: games_list[i],
            boxart: boxart,
            slug: slug
        };
        games.push(game);
    }

    return games;
}

function addStaticInfo(users) {
    var allPlatforms = ["Steam", "Xbox", "Playstation", "Twitch"];
    for (var i = 0; i < users.length; i++) {
        //I won't even bother commenting this mess, it is only temporary
        users[i].platforms = allPlatforms.sort(function () {return 0.5 - Math.random()}).slice(0, Math.floor(Math.random() * allPlatforms.length) + 1);
        users[i].profile_pic = "http://iconshow.me/media/images/Mixed/small-n-flat-icon/png2/64/-profile-filled.png";
    }
    return users;
}

module.exports = router;
