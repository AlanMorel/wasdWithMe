var express = require('express');
var router = express.Router();

var data = require('../utility/data');

router.get('/', function(req, res, next) {
    var query = req.query.q;
    data.search(query, 10, req, res, sendJSON);
});

var sendJSON = function(req, res, query, results) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
};

module.exports = router;
