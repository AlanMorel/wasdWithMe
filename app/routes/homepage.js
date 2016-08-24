var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('homepage', {
        title: 'wasdWithMe - Connect with gamers.',
        layout: 'primary',
        file: 'homepage',
        user : req.user
    });
});

module.exports = router;
