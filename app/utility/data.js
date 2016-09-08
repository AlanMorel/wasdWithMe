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

        for (var i = 0; i < games.length; i++){
            addToResults(results,
                "game",
                games[i].name,
                "https://static-cdn.jtvnw.net/ttv-boxart/" + encodeURI(games[i].name) + "-136x190.jpg",
                games[i].description
            );
        }

        if (results.length < 1){
            callApi(req, res, query, ret);
            return;
        }

        results = results.slice(0, limit);

        ret(req, res, query, results);
    });
};

function callApi(req, res, query, ret){

    var api = {
        fields: "?fields=" + encodeURI("name,summary,release_dates"),
        limit:  "&limit="  + 10,
        offset: "&offset=" + 0,
        order:  "&order="  + encodeURI("release_dates.date:desc"),
        query:  "&search=" + query
    };

    var request = config.api_url + api.fields  + api.limit + api.offset + api.order + api.query;

    unirest.get(request)
        .header("X-Mashape-Key", config.api_key)
        .header("Accept", "application/json")
        .end(function (result) {

            var results = [];

            if (result.status != 200){
                return results;
            }

            result.body.forEach(function(game){
                addToResults(results,
                    "game",
                    game.name,
                    "https://static-cdn.jtvnw.net/ttv-boxart/" + encodeURI(game.name) + "-136x190.jpg",
                    game.summary
                );
            });
            console.log(results);
            ret(req, res, query, results);
        });
}

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