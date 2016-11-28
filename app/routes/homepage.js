var router  = require('express').Router();

var unirest = require('unirest');
var helper  = require('../utility/helper');
var Logger  = require('../utility/logger');
var User    = require('../models/user');
var Game    = require('../models/game');
var config  = require('../config');

var popularGames = ["Rocket League", "Rust", "Overwatch", "Destiny", "Dead by Daylight", "Minecraft", "World of Warcraft", "FIFA 16", "Call of Duty: Black Ops III", "Smite", "Grand Theft Auto V", "StarCraft II", "DayZ", "Battlefield 4", "RuneScape"];
var featuredGames = ["Watch Dogs 2", "Rocket League", "Destiny"];

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

        var featuredQuery = {
            $or:[
                {'name': featuredGames[0].toLowerCase()},
                {'name': featuredGames[1].toLowerCase()},
                {'name': featuredGames[2].toLowerCase()}
            ]
        };

        Game.find(featuredQuery).exec(function (err, featuredGames){

            if (err || !featuredGames){
                Logger.log("Searching for featured games failed.", err);
            }

            var newsapi = {
                source: "?source=" + config.newsapi_source,
                sortBy: "&sortBy=top",
                apiKey: "&apiKey=" + config.newsapi_key
            };

            var request = config.newsapi_url + newsapi.source + newsapi.sortBy + newsapi.apiKey;

            unirest
                .get(request)
                .header("Accept", "application/json")
                .timeout(config.timeout)
                .end(function (response) {
                        //console.log(response);
                        //if something went wrong
                        if (response.status != 200){
                            return;
                        }

                        res.render('homepage', {
                            title: 'WASD With Me - Connect with gamers.',
                            layout: 'primary',
                            file: 'homepage',
                            user: req.user,
                            featured_games: featuredGames,
                            popular_games: getGames(popularGames).concat(getGames(popularGames)),
                            news: response.body.articles,
                            live_profile_users: users
                        });
                    }
                );
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
