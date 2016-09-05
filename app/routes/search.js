var express = require('express');
var router = express.Router();

var data = require('../utility/data');

//You should not be able to access /search directly
router.get('/', function (req, res, next) {
    res.render('404', {
        title: 'wasdWithMe - Error!',
        layout: 'primary',
        file: '404',
        user: req.user,
        message: 'Error, can\'t access this page!'
    });
});

router.post('/', function (req, res, next) {
    var query = req.body.query;
    data.search(query, 10, req, res, sendHTML);
});

var sendHTML = function(req, res, query, results) {
    res.render('search', {
        title: 'Search Results',
        layout: 'primary',
        file: 'search',
        user: req.user,
        query: query,
        results: results
    });
};

module.exports = router;
