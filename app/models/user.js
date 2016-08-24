var mongoose = require('mongoose');
var passportPlugin = require('passport-local-mongoose');
var config = require('../config');
var typeUrl  = require('mongoose-type-url');
var Schema = mongoose.Schema;
var url = mongoose.SchemaTypes.Url;
// var URLSlugs=require('mongoose-url-slugs');

// var oneUp = {
//   oneUpper_id: {type:mongoose.ObjectId},
//   created: {type:Date, default:Date.now}
// };

var oneUps = [{
  //oneUpper_id: {type:mongoose.ObjectI},
  oneUpper: {type:String,required:true}, //username of oneUpper opposed to object id
  created: {type:Date, default:Date.now}
}];

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
    top_games: [{
        type: String,
        validate: [arrayLimit, '{PATH} exceeds the limit of ' + config.topGamesLength]
    }],
    profile_pic: {
        type: String
    },
    one_ups: {
        type: oneUps,
    },
    profile: {
        bio: {
            type: String,
            maxlength: config.bioMaxLength
        },
        images: [{
            url:{
              type:url,
              required:true
            },
            one_ups:{
              type: oneUps
            }
        }],
    },

    accounts:{
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
//options for passport-local
var passportOptions = {
  interval:         200,
  usernameUnique:   true,
  limitAttempts:    true,
  maxAttempts:      16,
  lastLoginField: 'last_login'
};

User.plugin(passportPlugin,passportOptions);
// User.plugin(URLSlugs('username',{field: 'slug'}));

module.exports = mongoose.model('User', User);
