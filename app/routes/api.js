var express = require('express');
var router = express.Router();

var data = require('../utility/data');

//returns back html of search results
router.get('/search', function(req, res, next) {
    var query = req.query.q;
    data.search(query, 10, req, res, sendResults);
});

//callback after searching
var sendResults = function(req, res, query, results) {
    res.render('partials/results', {
        results: results
    });
};

module.exports = router;
