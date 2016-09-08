var exports = module.exports = {};

var unirest  = require('unirest');
var async  = require('async');
var Logger = require('../utility/logger');
var User   = require('../models/user');
var Game   = require('../models/game');
var config = require('../config');

exports.search = function(query, limit, req, res, ret){

    if (query.length < 1){
        ret(req, res, query, null);
        return;
    }

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

    unirest.get(config.base_url + "?fields=name%2Csummary%2Crelease_dates&limit=10&offset=0&order=release_dates.date%3Adesc&search=" + query)
        .header("X-Mashape-Key", config.api_key)
        .header("Accept", "application/json")
        .end(function (result) {
            console.log("START API");
            console.log(result.status, result.headers, result.body);
            console.log("END API");
        });

    async.parallel({
        users: function (cb){ User.find(userQuery).exec(cb); },
        games: function (cb){ Game.find(gameQuery).exec(cb); }
    }, function(err, result){

        if (err){
            Logger.log("Querying database during search failed.", err);
            res.redirect("/");
            return;
        }

        var results = [];

        var users = result.users;
        var games = result.games;

        console.log("Users: " + users.length + " Games: " + games.length);

        for (var i = 0; i < users.length; i++){
            addToResults(results,
                "user",
                users[i].display_name,
                "/images/placeholder.png",
                users[i].tagline === undefined ? "" : users[i].tagline
            );
        }

        addToResults(results,
            "game",
            "Shadowverse",
            "https://static-cdn.jtvnw.net/ttv-boxart/Shadowverse-136x190.jpg",
            "Description of Shadowverse goes here."
        );

        for (var i = 0; i < games.length; i++){
            addToResults(results,
                "game",
                games[i].name,
                "https://static-cdn.jtvnw.net/ttv-boxart/" + games[i].name + "-136x190.jpg",
                games[i].description
            );
        }

        results = results.slice(0, limit);

        if (results.length < 1){
            ret(req, res, query, null);
            return;
        }

        ret(req, res, query, results);
    });
};

function addToResults(results, type, name, image, description){
    var item = {
        type: type,
        name: name,
        image: image,
        description: description
    };
    results.push(item);
    return results;
}