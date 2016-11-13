var router = require('express').Router();

var User   = require('../models/user');
var alert  = require('../utility/alert');
var helper = require('../utility/helper');
var config = require('../config');

//You should not be able to access /user/ directly
router.get('/', function(req, res, next) {
    return res.redirect("/");
});

//Returns back requested user
router.get('/:username', function(req, res, next) {
    var username = req.params.username;

    User.findByUsername(username.toLowerCase(), true, function(err, owner) {

        //if error or user not found, return userNotFound
        if (err || !owner){
            alert.send(req, res, 'User not found!', "We could not find any user named '" + username + "'.");
            return;
        }

        addInfo(owner, req.user);

        res.render('user', {
            title: owner.display_name,
            layout: 'primary',
            file: 'user',
            js: ["/javascript/twitch"],
            user : req.user,
            owner: owner,
            gender: config.gender[owner.gender],
            age: helper.getAge(owner.birthday),
            favorite_games: helper.getGames(owner.games, "fav"),
            steam_games: helper.getGames(owner.games, "steam"),
            other_games: helper.getGames(owner.games, "other"),
            is_owner: helper.isOwner(req.user, owner)
        });
    });
});

//adds information to the owner object
function addInfo(owner, user){
    owner.online_status = "online";
    owner.oneUpped = helper.hasOneUpped(owner.one_ups, user);
}

module.exports = router;
