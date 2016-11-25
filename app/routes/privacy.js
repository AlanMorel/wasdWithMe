var router = require('express').Router();

router.get('/', function(req, res, next) {
    res.render('privacy', {
        title: 'WASD With Me - Privacy Policy',
        layout: 'primary',
        file: 'privacy',
        user: req.user
    });
});

module.exports = router;
