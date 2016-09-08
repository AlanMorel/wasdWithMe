var mongoose = require('mongoose');

var Game = new mongoose.Schema({
    id:{
        type: Number,
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
    boxart: {
        type: String
    },
    owners: [{
        type: String
    }]
});

module.exports = mongoose.model('Game', Game);
