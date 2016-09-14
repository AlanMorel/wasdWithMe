var express = require('express');
var router = express.Router();

var multer     = require('multer');
var filesystem = require('fs');
var User       = require('../models/user');
var config     = require('../config');
var Logger     = require('../utility/logger');

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
            profile_pic: getProfilePic(owner),
            gender: config.gender[owner.gender],
            age: getAge(owner.birthday),
            all_games: getGames(owner.games),
            fav_games: getGames(owner.games.splice(0, 5)),
            is_owner: isOwner(req.user, owner)
        });
    });
});

var type = multer({ dest: 'uploads/'}).single('image');

router.post('/:username/edit', type, function(req, res) {
    var username = req.params.username;
    var slug = username.toLowerCase(); //properly slug

    var tagline = req.body.tagline;

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var bio = req.body.bio;

    var games = req.body.games;

    var availability = {
        weekdays: {
            morning: req.body.weekdaysmorning !== undefined,
            day: req.body.weekdaysday !== undefined,
            night: req.body.weekdaysnight !== undefined,
            never: req.body.weekdaysnever !== undefined
        },
        weekends: {
            morning: req.body.weekendsmorning !== undefined,
            day: req.body.weekendsday !== undefined,
            night: req.body.weekendsnight !== undefined,
            never: req.body.weekendsnever !== undefined
        }
    };

    var image = getImage(req.file);

    //validate data here, return error if there is one

    console.log("tagline: " + tagline
        + " firstname: " + firstname
        + " lastname: " + lastname
        + " bio: " + bio
        + " games: " + games
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

    if (image){
        update.profile_pic = image;
    }

    var options = {
        upsert: true
    };

    User.findOneAndUpdate(query, update, options, function(err, doc){
        if (err) {
            Logger.log("Updating user profile failed.", err);
        } else {
            console.log("Edited user profile successfully.");
        }
        res.redirect("/user/" + username);
    });
});

function getImage(data){
    if(!data){
        return;
    }
    var path = data.path;
    var image = {
        name: data.originalname,
        data: new Buffer(filesystem.readFileSync(path)).toString("base64"),
        size: data.size
    };
    filesystem.unlink(path);
    return image;
}

function addTemporaryInfo(owner){
    owner.online_status = "online";

    owner.accounts.steam.steam_id = "SharpAceX";
    owner.accounts.xbox.gamertag = "SharpAceX";
    owner.accounts.playstation.psn_id = "SharpAceX";
    owner.accounts.twitch.username = "SharpAceX";
}

function getGames(list){
    var games = [];
    for (var i = 0; i < list.length; i++) {
        games.push({
            name: list[i],
            uri: encodeURI(list[i])
        });
    }
    return games;
}

function isOwner(user, owner){
    return user && user.username === owner.username;
}

function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    return Math.floor(difference / year);
}

function getProfilePic(owner){
    if (!owner.profile_pic || !owner.profile_pic.data){
        return "/images/placeholder.png";
    }
    return "data:image/png;base64," + owner.profile_pic.data;
}

function userNotFound(res, user, username){
    Logger.log("User " + username + " was not found.");
    res.status(404);
    res.render('404', {
        title: 'User not found!',
        layout: 'primary',
        file: '404',
        user: user,
        message: username + " not found!"
    });
}

module.exports = router;
