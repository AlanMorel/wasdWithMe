var express = require('express');
var router = express.Router();

var async = require('async');
var User  = require('../models/user');
var Game  = require('../models/game');

//You should not be able to access /search directly
router.get('/', function(req, res, next) {
    res.render('404', {
        title: 'wasdWithMe - Error!',
        layout: 'primary',
        file: '404',
        user : req.user,
        message: 'Error, can\'t access this page!!'
    });
});

router.post('/', function(req, res, next) {
    var query = req.body.query;
    query = query.toLowerCase();

    console.log("Search query: " + query);

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
        var users = result.users;
        var games = result.games;
        console.log("Users: " + users.length);
        console.log("Games: " + games.length);
        callback(err, ret);
    });

    res.render('search', {
        title: 'wasdWithMe - Search Results',
        layout: 'primary',
        file: 'search',
        user: req.user,
        query: query
    });
});

module.exports = router;
