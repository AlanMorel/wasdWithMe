var express = require('express');
var router = express.Router();

var data = require('../utility/data');

router.get('/search', function(req, res, next) {
    var query = req.query.q;
    data.search(query, 10, req, res, sendResults);
});

var sendResults = function(req, res, query, results) {
    res.render('partials/results', {
        results: results
    });
};

module.exports = router;
