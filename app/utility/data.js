var unirest = require('unirest');
var async   = require('async');
var Logger  = require('../utility/logger');
var helper  = require('../utility/helper');
var User    = require('../models/user');
var Game    = require('../models/game');
var config  = require('../config');

function makeUserSearchRequest(ageMin, ageMax, gender, availability){
    var userSearchRequest = {
        ageMin: ageMin,
        ageMax: ageMax,
        gender: gender,
        availability: availability
    };
    return userSearchRequest;
}

function makeGameSearchRequest(){
    var gameSearchRequest = {
        //empty for now
    };
    return gameSearchRequest;
}

//returns a search request object to be used in the search function
function makeSearchRequest(req, res, query, page, users, games){
    var searchRequest = {
        req: req,     //the request object
        res: res,     //the response object
        query: query, //text that is being searched for
        page: page,   //what page number was requested
        users: users, //search request for users
        games: games  //search request for games
    };
    return searchRequest;
}

//returns an object containing functions to be called asynchronously and in parallel
function getAsyncFunctions(searchRequest){
    var query = searchRequest.query.toLowerCase();

    var asyncFunctions = {};

    if (searchRequest.users) {
        var userQuery = {
            username: {
                $regex: query + ".*"
            }
        };
        if (searchRequest.users.ageMin && searchRequest.users.ageMax){
            var today = new Date();

            var min = new Date(today);
            min.setFullYear(today.getFullYear() - searchRequest.users.ageMin);

            var max = new Date(today);
            max.setFullYear(today.getFullYear() - searchRequest.users.ageMax);

            userQuery.birthday = {
                $gte: max,
                $lt: min
            }
        }
        if (searchRequest.users.gender && searchRequest.users.gender >= 0){
            userQuery.gender = searchRequest.users.gender;
        }
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
//the information inside the searchRequest object
function search(searchRequest, callback){

    //if the query is too short, return
    if (searchRequest.query.length < 3){
        callback(searchRequest, null);
        return;
    }

    console.log("Query: " + searchRequest.query);

    //get the functions to be called asynchronously
    var asyncRequest = getAsyncFunctions(searchRequest);

    //call asynchronous functions
    async.parallel(asyncRequest, function(err, result){

        if (err){
            Logger.log("Querying database during search failed.", err);
            callback(searchRequest, null);
            return;
        }

        var users = result.users;
        var games = result.games;

        //the results to return
        var results = [];

        //if users returned, populate results
        if (users) {
            for (var i = 0; i < users.length; i++) {
                var name = users[i].display_name;
                var image = "/images/profile/" + users[i].display_name + ".png";
                var text = users[i].bio === undefined ? "" : users[i].bio;
                addToResults(results, "user", name, image, text);
            }
            console.log("Users: " + users.length);
        }

        //if games returned, populate results
        if (games) {
            for (var i = 0; i < games.length; i++) {
                var name = games[i].display_name;
                var image = games[i].boxart;
                var text = games[i].description;
                addToResults(results, "game", name, image, text);
            }
            console.log("Games: " + games.length);

            //if games are requested but none returned from the database
            //use the api to populate the results
            if (games.length < 1){
                callApi(searchRequest, results, callback, getAllGames);
                return;
            }
        }

        //call the callback function with the results
        callback(searchRequest, results);
    });
}

//returns the fields when searching for games via the api
function getFields(){
    var fields = ["name", "summary", "release_dates", "cover", "rating", "screenshots", "videos", "developers", "publishers"];
    return encodeURI(fields.join());
}

//makes a call to IGDB via their api to search through their databases for games
function callApi(searchRequest, results, callback, handler){

    var api = {
        fields: "?fields=" + getFields(),
        limit:  "&limit="  + config.api_max_per_query,
        offset: "&offset=" + 0,
        query:  "&search=" + searchRequest.query,
        filter: "&filter[category][eq]=0"
    };

    var request = config.api_url + api.fields + api.limit + api.offset + api.query + api.filter;

    unirest
        .get(request)
        .header("X-Mashape-Key", config.api_key)
        .header("Accept", "application/json")
        .timeout(config.api_timeout)
        .end(function (response) {

            //if something went wrong, call callback
            if (response.status != 200){
                callback(searchRequest, results);
                return;
            }

            //otherwise call handler with results and response
            results = handler(results, response);

            //finally, call callback with the results
            callback(searchRequest, results);
        }
    );
}

function getAllGames(results, response){
    //otherwise iterate through all the games and
    //add it to our results and database
    response.body.forEach(function(game){
        var name = game.name;
        var image = getBoxArt(game);
        var text = 'summary' in game ? game.summary : "";
        addToResults(results, "game", name, image, text);
        addToDatabase(game);
    });
    return results;
}

function getFirstGame(results, response){
    //in the case that no games were found
    if (response.body.length == 0){
        return;
    }

    //otherwise add every game to the database
    response.body.forEach(function(game){
        addToDatabase(game);
    });

    //then return just the first game, parsed
    return parseGame(response.body[0]);
}

//parses api data and returns a game object
function parseGame(game){
    var new_game = {
        id: game.id,
        name: helper.getCleanedGameName(game),
        display_name: game.name,
        description : 'summary' in game ? game.summary : "",
        boxart: getBoxArt(game),
        one_ups: []
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
    if (videos){
        new_game.videos = videos;
    }

    return new_game;
}

//adds a new game to the database for further use in the future
function addToDatabase(game){

    var newGame = parseGame(game);

    var query = {
        id: game.id
    };

    var options = {
        upsert: true
    };

    Game.findOneAndUpdate(query, newGame, options, function (err, doc) {
            if (err){
                Logger.log("Failed to add " + game.name + " from API.", err);
                return;
            }
            console.log("Added " + game.name + ".");
        }
    );
}

function getBoxArt(game){
    if ('cover' in game){
        return "https://res.cloudinary.com/igdb/image/upload/t_cover_big/" + game.cover.cloudinary_id + ".jpg";
    } else {
        return config.game_not_found_boxart;
    }
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
}

module.exports = {
    callApi: callApi,
    search: search,
    makeUserSearchRequest: makeUserSearchRequest,
    makeGameSearchRequest: makeGameSearchRequest,
    makeSearchRequest: makeSearchRequest,
    getAllGames: getAllGames,
    getFirstGame: getFirstGame
};
