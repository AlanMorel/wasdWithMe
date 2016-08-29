var mongoose = require('mongoose');
var passportPlugin = require('passport-local-mongoose');
var config = require('../config');
require('mongoose-type-url');
var url = mongoose.SchemaTypes.Url;

var oneUps = [{
    oneUpper: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
}];

var comments = [{
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    one_ups: {
        type: oneUps
    },
    deleted: {
        type: Boolean,
        default: 0
    }
}];

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
        },
    },
    profile_pic: {
        type: url
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
        type: oneUps
    },
    one_up_count: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        maxlength: config.bioMaxLength
    },
    fav_games: [{
        type: String
    }],
    images: [{
        url: {
            type: url,
            required: true
        },
        one_ups: {
            type: oneUps
        },
        comments: {
            type: comments
        },
    }],
    accounts: {
        steam: {
            steam_id: {
                type: String,
            },
        },
        xbox: {
            gamer_tag: {
                type: String,
            },
        },
        playstation: {
            psn_id: {
                type: String,
            },
        },
        twitch: {
            username: {
                type: String,
            },
        },
    },
    coins: {
        type: Number,
        default: 0
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
