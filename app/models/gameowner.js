var mongoose = require('mongoose');

var GameOwner = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    game: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('GameOwner', GameOwner);
