var express = require('express');
var router = express.Router();

var User   = require('../models/user');
var config = require('../config');

router.get('/:username', function(req, res, next) {
    var username = req.params.username;
    var usernameSlug = username.toLowerCase(); //properly slug it

    User.findByUsername(usernameSlug, true, function(err, owner) {

        if (err || !owner){
            userNotFound(res, req.user, username);
            return;
        }

        addTemporaryInfo(owner);
        console.log(owner); //debug purposes

        var games = ["Rocket League", "Rust", "Overwatch", "Destiny", "Dead by Daylight", "Minecraft", "World of Warcraft", "FIFA 16", "Call of Duty: Black Ops III", "Smite", "Grand Theft Auto V", "StarCraft II", "DayZ", "Battlefield 4", "RuneScape"];

        res.render('user', {
            title: 'wasdWithMe - ' + owner.display_name,
            layout: 'primary',
            file: 'user',
            user : req.user,
            owner: owner,
            gender: config.gender[owner.gender],
            age: getAge(owner.birthday),
            all_games: getGames(games),
            fav_games: getGames(games.splice(0, 5)),
            is_owner: isOwner(req.user, owner)
        });
    });
});

//add temporary info to profile owners for testing purposes
function addTemporaryInfo(owner){
    owner.tagline = "Hello, this is an example tagline! How are you?";
    owner.first_name = "Alan";
    owner.last_name = "Morel";
    //randomly generated bio courtesy of http://www.generatorland.com/glgenerator.aspx?id=124&rlx=y
    owner.bio = "Spent the 80's getting my feet wet with childrens books in Africa. Spent 2001-2004 supervising the production of pond scum in Orlando, FL. At the moment I'm marketing puppets in Ocean City, NJ. Spent college summers donating mosquito repellent in Pensacola, FL. Have some experience exporting human growth hormone for the government. Spent college summers buying and selling rocking horses in the aftermarket."
    owner.online_status = "online"; //"offline" to test offline status

    owner.accounts.steam.steam_id = "SharpAceX";
    owner.accounts.xbox.gamertag = "SharpAceX";
    owner.accounts.playstation.psn_id = "SharpAceX";
    owner.accounts.twitch.username = "SharpAceX";
}

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

function isOwner(user, owner){
    return user && user.username === owner.username;
}

function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    var age = Math.floor(difference / year);
    return age;
}

router.get('/:username/edit', function(req, res, next) {
    var username = req.params.username;
    console.log("Trying to edit " + username + "'s profile.");
    //Temporary response
    res.render('404', {
        title: 'wasdWithMe - Editing ' + username + ' profile!',
        layout: 'primary',
        file: '404',
        user: req.user,
        message: "Editing " + username + "'s profile!"
    });
});

function userNotFound(res, user, username){
    res.status(404);
    res.render('404', {
        title: 'wasdWithMe - User not found!',
        layout: 'primary',
        file: '404',
        user: user,
        message: username + " not found!"
    });
}

//You should not be able to access /user/ directly
router.get('/', function(req, res, next) {
    res.render('404', {
        title: 'wasdWithMe - Error!',
        layout: 'primary',
        file: '404',
        user : req.user,
        message: 'Error, can\'t access this page.'
    });
});

module.exports = router;
