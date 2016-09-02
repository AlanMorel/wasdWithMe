var express = require('express');
var router = express.Router();

//You should not be able to access /search directly
router.get('/', function(req, res, next) {
    res.render('404', {
        title: 'wasdWithMe - Error!',
        layout: 'primary',
        file: '404',
        user : req.user,
        message: 'Error, can\'t access this page!!'
    });
});

router.post('/', function(req, res, next) {
    var query = req.body.query;
    console.log("Search query: " + query);
    res.render('search', {
        title: 'wasdWithMe - Search Results',
        layout: 'primary',
        file: 'search',
        user: req.user,
        query: query
    });
});

module.exports = router;
