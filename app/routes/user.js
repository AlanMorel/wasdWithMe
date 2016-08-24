var express = require('express');
var router = express.Router();

var passport = require('passport');

router.get('/:username', function(req, res, next) {
    res.render('user', {
        title: 'wasdWithMe - ' + req.params.username,
        layout: 'primary',
        file: 'user',
        user : req.user,
        message: "Accessing " + req.params.username + "'s profile."
    });
});

//You should not be able to access /user/ directly
router.get('/', function(req, res, next) {
    res.render('user', {
        title: 'wasdWithMe - Error!',
        layout: 'primary',
        file: 'user',
        user : req.user,
        message: 'Error, can\'t access this page' //temporary
    });
});

module.exports = router;
