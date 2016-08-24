var mongoose = require('mongoose');
var plugin = require('passport-local-mongoose');
var config = require('../config');

var User = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        minlength: config.usernameMinLength,
        maxlength: config.usernameMaxLength,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: config.passwordMinLength,
        maxlength: config.passwordMaxLength
    },
    salt: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: config.emailMinLength,
        maxlength: config.emailMaxLength,
        unique: true
    },
    gender: {
        type: Number,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    location: {
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
    },
    first_name: {
        type: String,
        maxlength: config.nameMaxLength
    },
    last_name: {
        type: String,
        maxlength: config.nameMaxLength
    },
    profile: {
        bio: {
            type: String,
            maxlength: config.bioMaxLength
        },
        top_games: [{
            type: String,
            validate: [arrayLimit, '{PATH} exceeds the limit of ' + config.topGamesLength]
        }],
        profile_pic: {
            type: String
        },
        one_ups: {
            type: Number,
            default: 0
        },
        images: [{
            type: String
        }],
    },
    steam: {
        type: String
    },
    xbox: {
        type: String
    },
    playstation: {
        type: String
    },
    twitch: {
        type: String
    },
    coins: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: 0
    }

});

function arrayLimit(val) {
    return val.length <= config.topGamesLength;
}

User.plugin(plugin);

module.exports = mongoose.model('User', User);
