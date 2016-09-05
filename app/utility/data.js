var exports = module.exports = {};

var async = require('async');
var User  = require('../models/user');
var Game  = require('../models/game');

exports.search = function(query, limit, req, res, ret){

    var userQuery = {
        "username": {
            "$regex": query
        }
    };

    var gameQuery = {
        "game": {
            "$regex": query
        }
    };

    async.parallel({
        users: function (cb){ User.find(userQuery).exec(cb); },
        games: function (cb){ Game.find(gameQuery).exec(cb); }
    }, function(err, result){

        if (err){
            //handle this error properly
            console.log(err);
        }

        var results = [];

        var users = result.users;
        var games = result.games;

        console.log("Users: " + users.length);
        console.log("Games: " + games.length);

        for (var i = 0; i < users.length; i++){
            var user = {
                type: "user",
                name: users[i].display_name,
                image: "/images/placeholder.png",
                description: users[i].tagline === undefined ? "" : users[i].tagline
            }
            results.push(user);
        }

        var game = {
            name: "Shadowverse",
            description: "Description of Shadowverse goes here."
        }

        games.push(game);

        for (var i = 0; i < games.length; i++){
            var game = {
                type: "game",
                name: games[i].name,
                image: "https://static-cdn.jtvnw.net/ttv-boxart/" + games[i].name + "-136x190.jpg",
                description: games[i].description
            }
            results.push(game);
        }

        results = results.slice(0, limit);

        ret(req, res, query, results);
    });
};