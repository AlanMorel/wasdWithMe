var mongoose = require('mongoose');
var passportPlugin = require('passport-local-mongoose');
var config = require('../config');
var URLSlugs=require('mongoose-url-slugs');

// var oneUp = {
//   oneUpper_id: {type:ObjectID},
//   created: {type:Dat, default:Date.now}
// }

var User = new mongoose.Schema({
    username: {
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
            required: false
        },
        state: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
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
    created_at: {
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

User.plugin(passportPlugin);
User.plugin(URLSlugs('username',{field: 'slug'}));

module.exports = mongoose.model('User', User);
