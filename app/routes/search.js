var express = require('express');
var router = express.Router();

var data = require('../utility/data');

//handles search results
router.get('/', function (req, res, next) {
    var query = req.query.query;
    data.search(query, req, res, sendResults);
});

//renders the search results
var sendResults = function(req, res, query, results) {

    //we don't want to send more than 10 results to user
    results = results.slice(0, 10);

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
