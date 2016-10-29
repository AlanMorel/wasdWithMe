var router = require('express').Router();

//logs users out when they go to /logout/
router.get('/', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
