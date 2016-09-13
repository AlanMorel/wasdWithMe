var exports = module.exports = {};

var unirest = require('unirest');
var async   = require('async');
var Logger  = require('../utility/logger');
var User    = require('../models/user');
var Game    = require('../models/game');
var config  = require('../config');

exports.search = function(query, limit, req, res, display){

    if (query.length < 1){
        display(req, res, query, null);
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
                getProfilePic(users[i]),
                getDescription(users[i].bio)
            );
        }

        for (var i = 0; i < games.length; i++){
            addToResults(results,
                "game",
                games[i].display_name,
                games[i].boxart,
                games[i].description
            );
        }

        if (results.length < limit){
            callApi(req, res, query, limit, results, display);
            return;
        }

        results = results.slice(0, limit);

        display(req, res, query, results);
    });
};

function callApi(req, res, query, limit, results, display){

    var api = {
        fields: "?fields=" + encodeURI("name,summary,release_dates,cover"),
        limit:  "&limit="  + 10,
        offset: "&offset=" + 0,
        order:  "&order="  + encodeURI("release_dates.date:desc"),
        query:  "&search=" + query
    };

    var request = config.api_url + api.fields + api.limit + api.offset + api.order + api.query;

    unirest.get(request)
        .header("X-Mashape-Key", config.api_key)
        .header("Accept", "application/json")
        .end(function (result) {

            if (result.status != 200){
                display(req, res, query, results);
                return;
            }

            result.body.forEach(function(game){
                addToResults(results,
                    "game",
                    game.name,
                    getBoxArt(game),
                    'summary' in game ? getDescription(game.summary) : ""
                );
                addToDatabase(game);
            });

            results = results.slice(0, limit);

            display(req, res, query, results);
        }
    );
}

function getDescription(description){
    return description === undefined ? "" : description;
}

function getBoxArt(game){
    if ('cover' in game){
        return "https://res.cloudinary.com/igdb/image/upload/t_cover_big/" + game.cover.cloudinary_id + ".jpg";
    }
    return config.game_not_found_boxart;
}

function addToDatabase(game){
    var new_game = {
        id: game.id,
        name: getCleanedGameName(game),
        display_name: game.name,
        description: 'summary' in game ? game.summary : "",
        release_date: getReleaseDate(game),
        boxart: getBoxArt(game)
    }
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

function getCleanedGameName(game){
    var name = game.name
        .toLowerCase()
        .replace('é', 'e');
    return name;
}

function getReleaseDate(game){
    return 'release_dates' in game ? new Date(game.release_dates[0].date) : 0;
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

function getProfilePic(owner){
    console.log(owner);
    if (!owner.profile_pic || !owner.profile_pic.data){
        return "/images/placeholder.png";
    }
    return "data:image/png;base64," + owner.profile_pic.data;
}
