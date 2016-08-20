var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'wasdWithMe - Connect with gamers.',
        layout: 'primary'
    });
});

module.exports = router;
