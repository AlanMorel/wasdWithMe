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

router.get('/:game', function(req, res, next) {
    var query = req.params.game;
    console.log(query);

    if (query.length < 1){
        return;
    }

    query = query.toLowerCase();

    var gameQuery = {
        "name": {
            $regex : query + ".*"
        }
    };

    Game.findOne(gameQuery, function(err, game) {

        if (err){
            Logger.log("Searching for game " + query + " failed.", err);
            return;
        }

        return res.render('game', {
            title: game.display_name,
            layout: 'primary',
            file: 'game',
            user : req.user,
            game: game
        });
    });
});

module.exports = router;
