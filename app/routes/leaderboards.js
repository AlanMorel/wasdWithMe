var router = require('express').Router();

var Logger = require('../utility/logger');
var alert  = require('../utility/alert');
var User   = require('../models/user');

router.get('/', function(req, res, next) {

    var query = {
        'one_ups': -1
    };

    User.find().sort(query).limit(5).exec(function (err, users) {

        if (err || !users){
            Logger.log("Loading leaderboards failed.", err);
            alert.send(req, res, 'Loading leaderboards failed.', "Loading leaderboards failed.");
            return;
        }

        users = addInfo(users, req.user);

        res.render('leaderboards', {
            title: 'WASD With Me - Leaderboards',
            layout: 'primary',
            file: 'leaderboards',
            user: req.user,
            users: users
        });
    });
});

//adds information to users
function addInfo(users, user) {
    for (var i = 0; i < users.length; i++) {
        var rank = i + 1;
        users[i].rank = rank;
        users[i].rank_type = getRankType(rank);
    }
    return users;
}

function getRankType(rank){
    if (rank == 1){
        return "gold";
    } else if (rank == 2){
        return "silver";
    } else if (rank == 3){
        return "bronze";
    } else {
        return "normal"
    }
}


module.exports = router;
