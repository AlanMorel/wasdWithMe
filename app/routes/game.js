var express = require('express');
var router = express.Router();

var Game   = require('../models/game');
var config = require('../config');
var Logger = require('../utility/logger');
var data   = require('../utility/data');

//You should not be able to access /game/ directly
router.get('/', function(req, res, next) {
    return res.redirect("/");
});

//handles GET requests to /game/
router.get('/:game', function(req, res, next) {
    var query = decodeURI(req.params.game);

    //if no game given, redirect
    if (query.length < 1){
        res.redirect("/");
        return;
    }

    query = getCleanedName(query);

    console.log(query);

    var gameQuery = {
        "name": {
            $regex : query + ".*"
        }
    };

    //try and find the game, then display
    Game.findOne(gameQuery, function(err, game) {

        if (err){
            Logger.log("Searching for game " + query + " failed.", err);
            return gameNotFound(req, res, query);
        }

        //if game found, display, otherwise search via api for it
        if (game){
            displayGame(req, res, game);
        } else {
            var searchRequest = data.makeSearchRequest(req, res, query, 0, false, true);
            data.callApi(searchRequest, [], displayFirstGame, data.getFirstGame);
        }
    });
});

//callback for when calling the api
function displayFirstGame(searchRequest, game){
    //if api returned nothing, game could not be found
    if (!game){
        return gameNotFound(searchRequest.req, searchRequest.res, searchRequest.query);
    } else {
        //api returns array of games but we only want the first game
        console.log("calling display game");
        displayGame(searchRequest.req, searchRequest.res, game);
    }
}

//displays a game page to the user
function displayGame(req, res, game){

    var release = getReleaseDate(game.release_date);
    var banner = getBanner(game.screenshots);
    var rating = getRating(game.rating);
    var oneUpCount = getOneUpCount(game);

    return res.render('game', {
        title: game.display_name,
        layout: 'primary',
        file: 'game',
        user : req.user,
        game: game,
        release: release,
        banner: banner,
        rating: rating,
        one_up_count: oneUpCount
    });
}

function getOneUpCount(game){
    if (game.one_ups){
        return game.one_ups.length;
    } else {
        return 0;
    }
}

//returns the game's release date if one exists
function getReleaseDate(releaseDate){
    if (releaseDate) {
        var date = releaseDate;
        var locale = "en-us";
        var month = date.toLocaleString(locale, {month: "long"});

        return month + " " + date.getDate() + ", " + date.getFullYear();
    }
}

//returns banner of the game's page given the game's screenshots
function getBanner(screenshots){
    if (screenshots){
        //select a random screenshot as the game banner
        return screenshots[Math.floor(Math.random() * screenshots.length)];
    }
}

//returns object containing game rating and color
function getRating(rating){
    if (rating && rating > 0){
        var result = {
            number: Math.ceil(rating),
            color: getRatingColor(rating)
        };
        return result;
    }
}

//returns the color of the game rating, given the game's rating
function getRatingColor(rating){
    if (rating > 80){
        return "limegreen";
    } else if (rating > 60) {
        return "goldenrod";
    } else {
        return "firebrick";
    }
}

//cleans up a game name of edge-case characters
function getCleanedName(name){
    var ret = name
        .toLowerCase()
        .replace('é', 'e')
        .replace('&', 'and');
    return ret;
}

//called when a game was not found
function gameNotFound(req, res, query){
    res.status(404);
    res.render('404', {
        title: 'Game not found!',
        layout: 'primary',
        file: '404',
        user: req.user,
        message: "We could not find any game named '" + query + "'."
    });
}

module.exports = router;
