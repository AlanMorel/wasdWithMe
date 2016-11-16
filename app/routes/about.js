var router = require('express').Router();

router.get('/', function(req, res, next) {
    res.render('about', {
        title: 'WASD With Me - About',
        layout: 'primary',
        file: 'about',
        user: req.user
    });
});

module.exports = router;
