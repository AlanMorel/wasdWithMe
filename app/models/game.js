var mongoose = require('mongoose');

var Game = new mongoose.Schema({
    game: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Game', Game);
