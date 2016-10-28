var express = require('express');
var router = express.Router();

var Logger = require('../utility/logger');

//handles get request for all messages
router.get('/', function (req, res, next) {
    res.render('message', {
        title: 'All Messages',
        layout: 'primary',
        file: 'message',
        user: req.user,
        js: ["/socket.io/socket.io", "/javascript/messages"]
    });
});

//handles GET requests to /message/username
router.get('/:username', function (req, res, next) {

    //check if user is logged in

    var to = req.params.username;

    res.render('message', {
        title: 'Message with ' + to,
        layout: 'primary',
        file: 'message',
        user: req.user,
        js: ["/socket.io/socket.io", "/javascript/messages"],
        to: to
    });
});

module.exports = router;
