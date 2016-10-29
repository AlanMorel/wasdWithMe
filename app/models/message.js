var mongoose = require('mongoose');
var objects = require('../models/objects');

var Message = new mongoose.Schema({
    from: {
        type: String
    },
    to: {
        type: String
    },
    message: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', Message);
