var unirest = require('unirest');
var async   = require('async');
var Logger  = require('../utility/logger');
var User    = require('../models/user');
var Game    = require('../models/game');
var config  = require('../config');

//returns a search request object to be used in the search function
function makeSearchRequest(query, page, users, games){
    var searchRequest = {
        query: query, //text that is being searched for
        page: page, //what page offset do they want
        users: users, //boolean defining whether or not to include games
        games: games //boolean defining whether or not to include users
    };
    return searchRequest;
}

//returns an object containing functions to be called asynchronously and in parallel
function getAsyncFunctions(searchRequest){
    var query = searchRequest.query.toLowerCase();

    var asyncFunctions = {};

    if (searchRequest.users) {
        var userQuery = {
            "username": {
                $regex: query + ".*"
            }
        };
        asyncFunctions.users = function (cb){
            User.find(userQuery).exec(cb);
        };
    }

    if (searchRequest.games){
        var gameQuery = {
            "name": {
                $regex : query + ".*"
            }
        };
        asyncFunctions.games = function (cb){
            Game.find(gameQuery).exec(cb);
        };
    }

    return asyncFunctions;
}

//calls the callback function with results accumulated using
//the information given inside the searchRequest object
function search(searchRequest, req, res, callback){

    //if the query is too short, return
    if (searchRequest.query.length < 3){
        callback(req, res, searchRequest, null);
        return;
    }

    console.log("Query: " + searchRequest.query);

    //get the functions to be called asynchronously
    var asyncRequest = getAsyncFunctions(searchRequest);

    //call asynchronous functions
    async.parallel(asyncRequest, function(err, result){

        if (err){
            Logger.log("Querying database during search failed.", err);
            callback(req, res, searchRequest, null);
            return;
        }

        var users = result.users;
        var games = result.games;

        //the results to return
        var results = [];

        //if users returned, populate results
        if (users) {
            for (var i = 0; i < users.length; i++) {
                addToResults(results,
                    "user",
                    users[i].display_name,
                    getProfilePic(users[i]),
                    users[i].bio === undefined ? "" : users[i].bio
                );
            }
            console.log("Users: " + users.length);
        }

        //if games returned, populate results
        if (games) {
            for (var i = 0; i < games.length; i++) {
                addToResults(results,
                    "game",
                    games[i].display_name,
                    games[i].boxart,
                    games[i].description
                );
            }
            console.log("Games: " + games.length);

            //if games are requested but none returned from the database
            //use the api to populate the results
            if (games.length < 1){
                callApi(req, res, searchRequest, results, callback);
                return;
            }
        }

        //call the callback function with the results
        callback(req, res, searchRequest, results);
    });
}

//returns the fields when searching for games via the api
function getFields(){
    var fields = ["name", "summary", "release_dates", "cover", "rating", "screenshots", "videos", "developers", "publishers"];
    return encodeURI(fields.join());
}

function callApi(req, res, searchRequest, results, callback){

    var api = {
        fields: "?fields=" + getFields(),
        limit:  "&limit="  + config.api_max_per_query,
        offset: "&offset=" + searchRequest.page * config.results_per_page,
        query:  "&search=" + searchRequest.query,
        filter: "&filter[category][eq]=0"
    };

    var request = config.api_url + api.fields + api.limit + api.offset + api.query + api.filter;

    unirest.get(request)
        .header("X-Mashape-Key", config.api_key)
        .header("Accept", "application/json")
        .timeout(1000)
        .end(function (result) {

            if (result.status != 200){
                callback(req, res, searchRequest, results);
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

            callback(req, res, searchRequest, results);
        }
    );
}

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

    var videos = getVideos(game);
    if (screens){
        new_game.videos = videos;
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

function getVideos(game){
    try {
        var videos = [];
        game.videos.forEach(function(video){
            videos.push({
                title: video.name,
                link: video.video_id
            });
        });
        return videos;
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

module.exports = {
    callApi: callApi,
    search: search,
    makeSearchRequest: makeSearchRequest,
};
