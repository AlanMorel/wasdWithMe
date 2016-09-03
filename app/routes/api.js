var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var query = req.query.q;

    var results = [];

    results.push(query);
    results.push(query);
    results.push(query);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
});

module.exports = router;
