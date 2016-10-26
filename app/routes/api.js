var express = require('express');
var router = express.Router();

var data   = require('../utility/data');
var config = require('../config');

//returns back html of search results
router.get('/search', function(req, res, next) {
    var query = req.query.q;
    var type = req.query.type;

    var users = type === "all" || type === "users";
    var games = type === "all" || type === "games";
    var searchRequest = data.makeSearchRequest(query, 0, users, games);

    data.search(searchRequest, req, res, sendResults);
});

//callback after searching
var sendResults = function(req, res, searchRequest, results) {

    //we don't want to send more than 10 results to user
    results = results.slice(0, config.results_per_page);

    res.render('partials/results', {
        results: results
    });
};

module.exports = router;
