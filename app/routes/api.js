var router = require('express').Router();

var data   = require('../utility/data');
var config = require('../config');

//returns back html of search results
router.get('/search', function(req, res, next) {
    var query = req.query.q;
    var type = req.query.type;

    var users = type === "all" || type === "users";
    var userSearchRequest = users ? data.makeUserSearchRequest() : null;

    var games = type === "all" || type === "games";
    var gameSearchRequest = games ? data.makeGameSearchRequest() : null;

    var searchRequest = data.makeSearchRequest(req, res, query, 1, userSearchRequest, gameSearchRequest);

    data.search(searchRequest, sendResults);
});

//callback after searching
var sendResults = function(searchRequest, results) {

    //we don't want to send more than 10 results to user
    results = results.slice(0, config.results_per_page);

    searchRequest.res.render('partials/results', {
        results: results
    });
};

module.exports = router;
