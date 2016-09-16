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
    var query = decodeURI(req.params.game);
    console.log(query);

    if (query.length < 1){
        return;
    }

    query = query.toLowerCase();

    console.log(query);

    var gameQuery = {
        "name": {
            $regex : query + ".*"
        }
    };

    Game.findOne(gameQuery, function(err, game) {

        if (err){
            Logger.log("Searching for game " + query + " failed.", err);
        }

        if (!game){
            gameNotFound(res, req.user, query);
            return;
        }

        var release;

        if (game.release_date) {
            var date = game.release_date;
            var locale = "en-us";
            var month = date.toLocaleString(locale, {month: "long"});

            release = month + " " + date.getDay() + ", " + date.getFullYear();
        }
        return res.render('game', {
            title: game.display_name,
            layout: 'primary',
            file: 'game',
            user : req.user,
            game: game,
            release: release
        });
    });
});

function gameNotFound(res, user, game){
    res.status(404);
    res.render('404', {
        title: 'Game not found!',
        layout: 'primary',
        file: '404',
        user: user,
        message: game + " not found!"
    });
}

module.exports = router;
