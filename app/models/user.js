var mongoose = require('mongoose');
var passportPlugin = require('passport-local-mongoose');
var config = require('../config');
var objects = require('../models/objects');

var User = new mongoose.Schema({
    display_name: {
        type: String,
        required: true,
        minlength: config.usernameMinLength,
        maxlength: config.usernameMaxLength,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: config.emailMinLength,
        maxlength: config.emailMaxLength,
        unique: true
    },
    gender: {
        type: Number, //0 = male, 1= female, 2 = other
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
        }
    },
    first_name: {
        type: String,
        maxlength: config.nameMaxLength
    },
    last_name: {
        type: String,
        maxlength: config.nameMaxLength
    },
    tagline: {
        type: String,
        maxlength: config.taglineMaxLength
    },
    one_ups: {
        type: objects.oneUps
    },
    bio: {
        type: String,
        maxlength: config.bioMaxLength
    },
    availability:{
        weekdays: {
            type: objects.availabilityTimes
        },
        weekends: {
            type: objects.availabilityTimes
        }
    },
    images: [objects.image],
    accounts: {
        steam: {
            steam_id: {
                type: String
            },
            profileurl: {
                type: String
            },
            personaname: {
                type: String
            },
            avatarfull: {
                type: String
            }
        },
        xbox: {
            gamertag: {
                type: String
            }
        },
        playstation: {
            psn_id: {
                type: String
            }
        },
        twitch: {
            username: {
                type: String
            }
        }
    },
    games: [{
        name: {
            type: String
        },
        source: {
            type: String
        },
        steam: {
            appid: {
                type: Number
            },
            img_logo_url:{
                type: String
            },
            playtime_forever: {
                type: Number
            }
        }
    }],
    coins: {
        type: Number,
        default: 0
    },
    background: {
        type: String,
        default: "default"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: 0
    }
});

//options for passport-local
var passportOptions = {
    interval: 1000,
    usernameUnique: true,
    limitAttempts: true,
    maxAttempts: 16,
    lastLoginField: 'last_login',
    usernameLowerCase: true
};

User.plugin(passportPlugin, passportOptions);

module.exports = mongoose.model('User', User);
