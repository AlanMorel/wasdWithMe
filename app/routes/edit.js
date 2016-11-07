var router = require('express').Router();

var multer = require('multer');
var User   = require('../models/user');
var config = require('../config');
var Logger = require('../utility/logger');
var alert  = require('../utility/alert');
var helper = require('../utility/helper');

//handles GET requests to /username/edit
router.get('/:username/edit', function(req, res, next) {

    //in the case somebody isn't logged in but tries to edit
    if (!req.user){
        alert.send(req, res, 'Cannot edit profile', "You must log in to edit a profile.");
        return;
    }

    var username = req.params.username;
    var slug = username.toLowerCase();

    User.findByUsername(slug, true, function(err, owner) {

        if (err || !owner){
            alert.send(req, res, 'User not found!', "We could not find any user named '" + username + "'.");
            return;
        }

        //user tried to edit somebody else's profile
        if(!helper.isOwner(req.user, owner)){
            alert.send(req, res, 'Cannot edit profile', "You cannot edit somebody else's profile.");
            return;
        }

        addTemporaryInfo(owner);

        res.render('edit', {
            title: owner.display_name,
            layout: 'primary',
            file: 'edit',
            js: ['/javascript/edit', '/javascript/location'],
            user : req.user,
            owner: owner,
            gender: config.gender[owner.gender],
            age: helper.getAge(owner.birthday),
            all_games: getGames(owner.games, false),
            fav_games: getGames(owner.games, true),
            is_owner: helper.isOwner(req.user, owner)
        });
    });
});

//set the image destination and name as "username.png"
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/images/profile/')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.username.toLowerCase() + '.png')
    }
});

//limit the size of images to 4MB and set the storage engine
var uploadOptions = {
    dest: '../public/images/profile/',
    limits: {
        fileSize: Math.pow(2, 20) * 4, // 4MB
        files: 1
    },
    storage: storage
};

var type = multer(uploadOptions).single('image');

//handles POST requests to /username/edit
router.post('/:username/edit', type, function(req, res) {
    var username = req.params.username;
    var slug = username.toLowerCase();

    var tagline = req.body.tagline.substring(0, config.taglineMaxLength);

    var firstname = req.body.firstname.substring(0, config.nameMaxLength);
    var lastname = req.body.lastname.substring(0, config.nameMaxLength);

    var bio = req.body.bio.substring(0, config.bioMaxLength);

    var games = populateGames(req.body.games, req.body.favorite);

    var location = {
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
    };

    var availability = {
        weekdays: {
            morning: req.body.weekdaysmorning !== undefined,
            day: req.body.weekdaysday !== undefined,
            night: req.body.weekdaysnight !== undefined
        },
        weekends: {
            morning: req.body.weekendsmorning !== undefined,
            day: req.body.weekendsday !== undefined,
            night: req.body.weekendsnight !== undefined
        }
    };

    var query = {
        'username': slug
    };

    var update = {
        tagline: tagline,
        first_name: firstname,
        last_name: lastname,
        bio: bio,
        location: location,
        availability: availability,
        games: games
    };

    var options = {
        upsert: true
    };

    User.findOneAndUpdate(query, update, options, function(err, doc){
        if (err) {
            Logger.log("Updating user profile failed.", err);
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

module.exports = router;
