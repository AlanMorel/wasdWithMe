var mongoose = require('mongoose');

var Game = new mongoose.Schema({
    game_id:{
        type: Number,
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    release_date: {
        type: Date
    },
    owners: [{
        type: String
    }]
});

module.exports = mongoose.model('Game', Game);
