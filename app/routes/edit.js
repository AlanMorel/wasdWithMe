var express = require('express');
var router = express.Router();

var multer     = require('multer');
var filesystem = require('fs');
var User       = require('../models/user');
var config     = require('../config');
var Logger     = require('../utility/logger');

//handles GET requests to /username/edit
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
            file: 'edit',
            user : req.user,
            owner: owner,
            profile_pic: getProfilePic(owner),
            gender: config.gender[owner.gender],
            age: getAge(owner.birthday),
            all_games: getGames(owner.games, false),
            fav_games: getGames(owner.games, true),
            is_owner: isOwner(req.user, owner)
        });
    });
});

var type = multer({ dest: 'uploads/'}).single('image');

//handles POST requests to /username/edit
router.post('/:username/edit', type, function(req, res) {
    var username = req.params.username;
    var slug = username.toLowerCase(); //properly slug

    var tagline = req.body.tagline;

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var bio = req.body.bio;

    var games = populateGames(req.body.games, req.body.favorite);

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


//populates games to insert into database
function populateGames(games, favorite){
    var populated = [];
    for (var i = 0; i < games.length; i++){
        populated.push({
            name: games[i],
            favorite: favorite === undefined ? false : favorite[i]
        });
    }
    return populated;
}

//returns image object of uploaded profile picture
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

//adds temporary data to the owner object
function addTemporaryInfo(owner){
    owner.online_status = "online";

    owner.accounts.steam.steam_id = "Alan";
    owner.accounts.xbox.gamertag = "Alan";
    owner.accounts.playstation.psn_id = "Alan";
    owner.accounts.twitch.username = "Alan";
}

//returns list of game names, encoded uri and favorite boolean
function getGames(list, fav){
    var games = [];
    for (var i = 0; i < list.length; i++) {
        if (fav && !list[i].favorite){
            continue;
        }
        games.push({
            name: list[i].name,
            uri: encodeURI(list[i].name),
            favorite: list[i].favorite
        });
    }
    return games;
}

//returns true if user is on own page
function isOwner(user, owner){
    return user && user.username === owner.username;
}

//returns age of user in years
function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    return Math.floor(difference / year);
}

//returns profile picture of page owner, if none exist, returns placeholder
function getProfilePic(owner){
    if (!owner.profile_pic || !owner.profile_pic.data){
        return "/images/placeholder.png";
    }
    return "data:image/png;base64," + owner.profile_pic.data;
}

//gets called when user was not found (should not occur under normal circumstances)
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
