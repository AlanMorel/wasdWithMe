var router = require('express').Router();

var data   = require('../utility/data');
var helper = require('../utility/helper');
var steam  = require('../utility/steam');
var twitch = require('../utility/twitch');
var config = require('../config');
var User   = require('../models/user');
var Game   = require('../models/game');
var fs     = require("fs");

function loadJson(file){
    var json = fs.readFileSync(__dirname + file, 'utf8');
    return JSON.parse(json);
}

var locations = loadJson('/../data/locations.json');

//returns back html of search results
router.get('/search', function(req, res, next) {
    var query = req.query.q;
    var type = req.query.type;

    var users = type === "all" || type === "users";
    var userSearchRequest = users ? data.makeUserSearchRequest() : null;

    var games = type === "all" || type === "games";
    var gameSearchRequest = games ? data.makeGameSearchRequest() : null;

    var searchRequest = data.makeSearchRequest(req, res, query, 1, userSearchRequest, gameSearchRequest);

    data.search(searchRequest, sendResults);
});

//callback after searching
var sendResults = function(searchRequest, results) {

    //we don't want to send more than 10 results to user
    results = results.slice(0, config.results_per_page);

    searchRequest.res.render('partials/results', {
        results: results
    });
};

//handles one up requests
router.get('/oneup', function(req, res, next) {

    var id = req.query.id;
    var type = req.query.type;

    var model = getModelByType(type);

    //if not logged in or null model, return nothing
    if(!req.user || !model){
        res.status(500).send("User not logged in or model not found.");
        return;
    }

    model.findById(id, "one_ups", function (err, object) {

        //if error or object not found, return nothing
        if (err || !object){
            res.status(500).send("Loading from database error.");
            return;
        }

        var index = helper.getOneUppedIndex(object.one_ups, req.user);

        //if oneUpped, remove it, otherwise push to array
        if (index >= 0){
            object.one_ups.splice(index, 1);
        } else {
            var oneUp = {
                one_upper: req.user.username
            };
            object.one_ups.push(oneUp);
        }

        //save the object back into the database and send response
        object.save(function(err) {
            if (err) {
                res.status(500).send("Saving to database error.");
                return;
            }
            res.send(JSON.stringify(index));
        });
    });
});

//get the model object by the type name
function getModelByType(type){
    if (type === "user"){
        return User;
    } else if (type === "game"){
        return Game;
    } else {
        return null;
    }
}

//returns back select html of locations
router.get('/locations', function(req, res, next) {
    var type = req.query.type;
    var country = req.query.country;
    var state = req.query.state;

    if (country === "undefined"){
        var results = Object.keys(locations);
    } else if (state === "undefined"){
        var results = Object.keys(locations[country]);
    } else {
        var results = locations[country][state];
    }

    res.render('partials/locations', {
        type: type,
        locations: results
    });
});


router.get('/steam', function(req, res, next) {
    var id = req.query.id;

    steam.loadUser(id, function(steamUser){

        if(!steamUser){
            //return an error message
            return;
        }

        console.log(steamUser);

        steam.loadGames(id, function(steamGames){

            if(!steamGames){
                //return an error message
                return;
            }

            console.log(steamGames);

            res.render('partials/steam', {
                user: steamUser,
                games: steamGames
            });
        });
    });
});

router.get('/twitch', function(req, res, next) {
    var username = req.query.username;

    twitch.loadChannel(username, function(channel){

        if(!channel){
            //return an error message
            return;
        }

        //console.log(channel);
        res.render('partials/twitch', {
            channel: channel
        });
    });
});

module.exports = router;
