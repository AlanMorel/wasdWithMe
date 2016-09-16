var express = require('express');
var router = express.Router();

var User   = require('../models/user');
var config = require('../config');
var Logger = require('../utility/logger');
var data   = require('../utility/data');

//You should not be able to access /game/ directly
router.get('/', function(req, res, next) {
    return res.redirect("/");
});

router.get('/:game', function(req, res, next) {
    var game = req.params.game;
    console.log(game);
    data.search(game, 1, req, res, sendHTML);
});

var sendHTML = function(req, res, query, results) {
    console.log(results[0]);
    res.render('game', {
        title: query,
        layout: 'primary',
        file: 'game',
        user: req.user,
        query: query,
        game: results[0]
    });
};

module.exports = router;
