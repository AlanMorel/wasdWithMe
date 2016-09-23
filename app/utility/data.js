var exports = module.exports = {};

var unirest = require('unirest');
var async   = require('async');
var Logger  = require('../utility/logger');
var User    = require('../models/user');
var Game    = require('../models/game');
var config  = require('../config');

exports.search = function(query, req, res, callback){

    if (query.length < 3){
        callback(req, res, query, null);
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
            $regex : query + ".*"
        }
    };

    async.parallel({
        users: function (cb){
            User.find(userQuery).exec(cb);
        },
        games: function (cb){
            Game.find(gameQuery).exec(cb);
        }
    }, function(err, result){

        var results = [];

        if (err){
            Logger.log("Querying database during search failed.", err);
            callback(req, res, query, results);
            return;
        }

        var users = result.users;
        var games = result.games;

        console.log("Query: " + query + " Users: " + users.length + " Games: " + games.length);

        for (var i = 0; i < users.length; i++){
            addToResults(results,
                "user",
                users[i].display_name,
                getProfilePic(users[i]),
                users[i].bio === undefined ? "" : users[i].bio
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

        if (results.length < 1){
            callApi(req, res, query, results, callback);
            return;
        }

        callback(req, res, query, results);
    });
};

exports.callApi = function(req, res, query, results, callback){

    var api = {
        fields: "?fields=" + encodeURI("name,summary,release_dates,cover,rating,screenshots,developers,publishers"),
        limit:  "&limit="  + 50, //maximum allowed per api
        offset: "&offset=" + 0,
        query:  "&search=" + query,
        filter: "&filter[category][eq]=0"
    };

    var request = config.api_url + api.fields + api.limit + api.offset + api.query + api.filter;

    unirest.get(request)
        .header("X-Mashape-Key", config.api_key)
        .header("Accept", "application/json")
        .timeout(1000)
        .end(function (result) {

            if (result.status != 200){
                callback(req, res, query, results);
                return;
            }

            result.body.forEach(function(game){
                addToResults(results,
                    "game",
                    game.name,
                    getBoxArt(game),
                    'summary' in game ? game.summary : ""
                );
                addToDatabase(game);
            });

            callback(req, res, query, results);
        }
    );
};

function addToDatabase(game){
    var new_game = {
        id: game.id,
        name: getCleanedGameName(game),
        display_name: game.name,
        description : 'summary' in game ? game.summary : "",
        boxart: getBoxArt(game)
    };

    var date = getReleaseDate(game);
    if (date > 0){
        new_game.release_date = new Date(date);
    }

    var rating = getRating(game);
    if (rating > 0){
        new_game.rating = rating;
    }

    var screens = getScreenshots(game);
    if (screens){
        new_game.screenshots = screens;
    }

    Game.update(
        {id: game.id},
        {$setOnInsert: new_game},
        {upsert: true},
        function (err, numAffected) {
            if (err){
                Logger.log("Adding " + game.name + " from API to failed.", err);
                return;
            }
            console.log("Added " + game.name + ".");
        }
    );
}

function getCleanedGameName(game){
    var name = game.name
        .toLowerCase()
        .replace('é', 'e')
        .replace('&', 'and');
    return name;
}

function getBoxArt(game){
    if ('cover' in game){
        return "https://res.cloudinary.com/igdb/image/upload/t_cover_big/" + game.cover.cloudinary_id + ".jpg";
    }
    return config.game_not_found_boxart;
}

function getScreenshots(game){
    try {
        var screenshots = [];
        game.screenshots.forEach(function(screen){
            screenshots.push(screen.cloudinary_id);
        });
        return screenshots;
    } catch (err) {
        return null;
    }
}

function getReleaseDate(game){
    try {
        return game.release_dates[0].date;
    } catch (err){
        return 0;
    }
}

function getRating(game){
    try {
        return game.rating;
    } catch (err){
        return 0;
    }
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
    if (!owner.profile_pic || !owner.profile_pic.data){
        return "/images/placeholder.png";
    }
    return "data:image/png;base64," + owner.profile_pic.data;
}
