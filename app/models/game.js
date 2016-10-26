var mongoose = require('mongoose');
var objects = require('../models/objects');

var Game = new mongoose.Schema({
    id:{
        type: Number
    },
    name: {
        type: String
    },
    display_name: {
        type: String
    },
    description: {
        type: String
    },
    release_date: {
        type: Date
    },
    rating: {
        type: Number
    },
    boxart: {
        type: String
    },
    screenshots: [{
       type: String
    }],
    videos: [{
        title: {
            type: String
        },
        link: {
            type: String
        }
    }],
    owners: [{
        type: String
    }],
    one_ups: {
        type: objects.oneUps
    }
});

module.exports = mongoose.model('Game', Game);
