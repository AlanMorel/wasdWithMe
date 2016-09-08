var exports = module.exports = {};

var unirest = require('unirest');
var async   = require('async');
var Logger  = require('../utility/logger');
var User    = require('../models/user');
var Game    = require('../models/game');
var config  = require('../config');

exports.search = function(query, limit, req, res, ret){

    if (query.length < 1){
        ret(req, res, query, null);
        return;
    }

    query = query.toLowerCase();

    var userQuery = {
        "username": {
            $regex : query + ".*"
        }
    };

    var gameQuery = {
        "name": {
            $regex : ".*" + query + ".*"
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

        var users = result.users;
        var games = result.games;

        console.log("Query: " + query + " Users: " + users.length + " Games: " + games.length);

        var results = [];

        for (var i = 0; i < users.length; i++){
            addToResults(results,
                "user",
                users[i].display_name,
                "/images/placeholder.png",
                getDescription(users[i].bio, 500)
            );
        }

        for (var i = 0; i < games.length; i++){
            addToResults(results,
                "game",
                games[i].display_name,
                games[i].boxart,
                getDescription(games[i].description, 300)
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
        fields: "?fields=" + encodeURI("name,summary,release_dates,cover"),
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

            if (result.status != 200){
                ret(req, res, query, null);
                return;
            }

            var results = [];

            result.body.forEach(function(game){
                addToResults(results,
                    "game",
                    game.name,
                    getBoxArt(game),
                    'summary' in game ? getDescription(game.summary, 300) : ""
                );
                addToDatabase(game);
            });

            ret(req, res, query, results);
        });
}

function getDescription(description, limit){
    if (description === undefined){
        return "";
    }
    if (description.length < limit){
        return description;
    }
    return description.substring(0, limit) + "...";
}

function getBoxArt(game){
    if ('cover' in game){
        var size = "cover_big";
        return "https://res.cloudinary.com/igdb/image/upload/t_" + size + "/" + game.cover.cloudinary_id + ".jpg";
    }
    return "https://static-cdn.jtvnw.net/ttv-static/404_boxart-136x190.jpg";
}

function addToDatabase(game){
    var new_game = {
        id: game.id,
        name: game.name.toLowerCase(),
        display_name: game.name,
        description: 'summary' in game ? game.summary : "",
        release_date: getReleaseDate(game),
        boxart: getBoxArt(game)
    }
    console.log("Trying to add " + game.name + ".");
    Game.update(
        {id: game.id},
        {$setOnInsert: new_game},
        {upsert: true},
        function (err, numAffected) {
            if (err){
                Logger.log("Adding new games from API to database failed.", err);
                return;
            }
            console.log("Added " + game.name + " successfully.");
        }
    );
}

function getReleaseDate(game){
    if ('release_dates' in game){
        return new Date(game.release_dates[0].date);
    }
    return 0;
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