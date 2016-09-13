var express = require('express');
var router = express.Router();

var User   = require('../models/user');
var config = require('../config');
var Logger = require('../utility/logger');

//You should not be able to access /game/ directly
router.get('/', function(req, res, next) {
    return res.redirect("/");
});

router.get('/:game', function(req, res, next) {
    var game = req.params.game;
    console.log(game);
    return res.send(game);
});

module.exports = router;
