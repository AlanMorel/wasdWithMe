var express = require('express');
var router = express.Router();

var data = require('../utility/data');

//returns back html of search results
router.get('/search', function(req, res, next) {
    var query = req.query.q;

    var searchRequest = data.makeSearchRequest(query, 0, true, true);

    data.search(searchRequest, req, res, sendResults);
});


//callback after searching
var sendResults = function(req, res, searchRequest, results) {

    //we don't want to send more than 10 results to user
    results = results.slice(0, 10);

    res.render('partials/results', {
        results: results
    });
};

module.exports = router;
