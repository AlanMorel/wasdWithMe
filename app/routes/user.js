var express = require('express');
var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: 'upload/'});
var fs = require('fs');

var User   = require('../models/user');
var config = require('../config');
var Logger = require('../utility/logger');

router.get('/:username', function(req, res, next) {
    var username = req.params.username;
    var usernameSlug = username.toLowerCase(); //properly slug it

    User.findByUsername(usernameSlug, true, function(err, owner) {

        if (err || !owner){
            userNotFound(res, req.user, username);
            return;
        }

        addTemporaryInfo(owner);

        res.render('user', {
            title: owner.display_name,
            layout: 'primary',
            file: 'user',
            user : req.user,
            owner: owner,
            gender: config.gender[owner.gender],
            age: getAge(owner.birthday),
            all_games: getGames(owner.games),
            fav_games: getGames(owner.games.splice(0, 5)),
            is_owner: isOwner(req.user, owner)
        });
    });
});

//add temporary info to profile owners for testing purposes
function addTemporaryInfo(owner){
    owner.online_status = "online";

    owner.accounts.steam.steam_id = "SharpAceX";
    owner.accounts.xbox.gamertag = "SharpAceX";
    owner.accounts.playstation.psn_id = "SharpAceX";
    owner.accounts.twitch.username = "SharpAceX";
}

function getGames(games_list){
    var games = [];

    for (var i = 0; i < games_list.length; i++) {
        var name = games_list[i];
        var boxart = encodeURI(name);
        var slug = name.replace(/ /g, '').replace(/:/g, '');
        var game = {
            name: games_list[i],
            boxart: boxart,
            slug: slug
        };
        games.push(game);
    }
    return games;
}

function isOwner(user, owner){
    return user && user.username === owner.username;
}

function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    var age = Math.floor(difference / year);
    return age;
}

router.get('/:username/edit', function(req, res, next) {
    var username = req.params.username;
    var slug = username.toLowerCase(); //properly slug it

    User.findByUsername(slug, true, function(err, owner) {

        if (err || !owner){
            userNotFound(res, req.user, username);
            return;
        }

        addTemporaryInfo(owner);

        res.render('edit', {
            title: owner.display_name,
            layout: 'primary',
            file: 'user',
            user : req.user,
            owner: owner,
            gender: config.gender[owner.gender],
            age: getAge(owner.birthday),
            all_games: getGames(owner.games),
            fav_games: getGames(owner.games.splice(0, 5)),
            is_owner: isOwner(req.user, owner)
        });
    });
});

var type = upload.single('image');

router.post('/:username/edit', type, function(req, res) {
    var username = req.params.username;
    var slug = username.toLowerCase(); //properly slug

    var tagline = req.body.tagline;

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var bio = req.body.bio;

    var games = req.body.games;

    var image = req.body.image;

    console.log(image);

    var weekdays = {
        morning: req.body.weekdaysmorning !== undefined,
        day: req.body.weekdaysday !== undefined,
        night: req.body.weekdaysnight !== undefined,
        never: req.body.weekdaysnever !== undefined
    };

    var weekends = {
        morning: req.body.weekendsmorning !== undefined,
        day: req.body.weekendsday !== undefined,
        night: req.body.weekendsnight !== undefined,
        never: req.body.weekendsnever !== undefined
    };

    var availability = {
        weekdays: weekdays,
        weekends: weekends
    };

    //validate data here, return error if there is one

    console.log("tagline: " + tagline
    + " firstname: " + firstname
    + " lastname: " + lastname
    + " bio" + bio
    + "games: " + games
    );

    var query = {
        'username': slug
    };

    var update = {
        tagline: tagline,
        first_name: firstname,
        last_name: lastname,
        bio: bio,
        availability: availability,
        games: games
    };

    var options = {
        upsert: true
    };

    if (req.file) {
        var image = req.file;
        var profile_pic = {
            "originalName": image.originalName,
            "size": image.size,
            "b64": new Buffer(fs.readFileSync(image.path)).toString("base64")
        };
        //do something with image
        fs.unlink(image.path);
    }

    User.findOneAndUpdate(query, update, options, function(err, doc){
        if (err) {
            Logger.log("Updating user profile failed.", err);
            res.redirect("/");
            return;
        }
    });

    console.log("Edited user profile successfully.");
    res.redirect("/user/" + username);
});

function userNotFound(res, user, username){
    res.status(404);
    res.render('404', {
        title: 'User not found!',
        layout: 'primary',
        file: '404',
        user: user,
        message: username + " not found!"
    });
}

//You should not be able to access /user/ directly
router.get('/', function(req, res, next) {
    return res.redirect("/");
});

module.exports = router;
