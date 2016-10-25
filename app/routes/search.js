var express = require('express');
var router = express.Router();

var data = require('../utility/data');

//handles search results
router.get('/', function (req, res, next) {
    var query = req.query.query;
    var type = req.query.type;

    var searchRequest = data.makeSearchRequest(query, 0, type != "games", type != "users");

    data.search(searchRequest, req, res, sendResults);
});

//renders the search results
var sendResults = function(req, res, searchRequest, results) {

    //we don't want to send more than 10 results to user
    results = results.slice(0, 10);

    res.render('search', {
        title: 'Search Results',
        layout: 'primary',
        file: 'search',
        user: req.user,
        query: searchRequest.query,
        results: results
    });
};

module.exports = router;
