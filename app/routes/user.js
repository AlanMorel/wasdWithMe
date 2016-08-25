var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/:username', function(req, res, next) {
    var username = req.params.username;
    var usernameSlug = username.toLowerCase(); //properly slug it

    User.findByUsername(usernameSlug, true, function(err, owner) {
        if (err || !owner){
            userNotFound(res, req.user, username);
            return;
        }
        console.log(owner);
        res.render('user', {
            title: 'wasdWithMe - ' + username,
            layout: 'primary',
            file: 'user',
            user : req.user,
            owner: owner
        });
    });
});

function userNotFound(res, user, username){
    res.status(404);
    res.render('404', {
        title: 'wasdWithMe - User not found!',
        layout: 'primary',
        file: '404',
        user: user,
        message: username + " not found!"
    });
}

//You should not be able to access /user/ directly
router.get('/', function(req, res, next) {
    res.render('404', {
        title: 'wasdWithMe - Error!',
        layout: 'primary',
        file: '404',
        user : req.user,
        message: 'Error, can\'t access this page.'
    });
});

module.exports = router;
