var mongoose = require('mongoose');

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
    owners: [{
        type: String
    }]
});

module.exports = mongoose.model('Game', Game);
