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
        js: ["/socket.io/socket.io", "/javascript/message"]
    });
});

//handles GET requests to /message/username
router.get('/:message', function (req, res, next) {

    //check if user is logged in

    var to = req.params.message;

    res.render('message', {
        title: 'Message with ' + to,
        layout: 'primary',
        file: 'message',
        user: req.user,
        js: ["/socket.io/socket.io", "/javascript/message"]
    });
});

module.exports = router;
