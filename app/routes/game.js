var router = require('express').Router();

var Game   = require('../models/game');
var config = require('../config');
var data   = require('../utility/data');
var alert  = require('../utility/alert');
var helper = require('../utility/helper');

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

    query = helper.getCleanedGameName(query);

    var gameQuery = {
        "name": {
            $regex : query + ".*"
        }
    };

    //try and find the game, then display
    Game.findOne(gameQuery, function(err, game) {

        //if game found, display, otherwise search via api for it
        if (game){
            displayGame(req, res, game);
        } else {
            var gameSearchRequest = data.makeGameSearchRequest();
            var searchRequest = data.makeSearchRequest(req, res, query, 0, null, gameSearchRequest);
            data.callApi(searchRequest, [], displayApiGame, data.getFirstGame);
        }
    });
});

//displays the game given from api results if found
function displayApiGame(searchRequest, game){
    if (game){
        displayGame(searchRequest.req, searchRequest.res, game);
    } else {
        alert.send(searchRequest.req, searchRequest.res, 'Game not found!', "We could not find any game named '" + searchRequest.query + "'.");
    }
}

//displays a game page to the user
function displayGame(req, res, game){

    var release = getReleaseDate(game.release_date);
    var banner = getBanner(game.screenshots);
    var rating = getRating(game.rating);

    return res.render('game', {
        title: game.display_name,
        layout: 'primary',
        file: 'game',
        user : req.user,
        game: game,
        release: release,
        banner: banner,
        rating: rating,
        oneUpped: helper.hasOneUpped(game.one_ups, req.user)
    });
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

//returns a random screenshot of the game as the banner
function getBanner(screenshots){
    if (screenshots){
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

module.exports = router;
