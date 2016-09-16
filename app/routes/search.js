var express = require('express');
var router = express.Router();

var data = require('../utility/data');

router.get('/', function (req, res, next) {
    var query = req.query.query;
    data.search(query, 10, req, res, sendResults);
});

var sendResults = function(req, res, query, results) {
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
