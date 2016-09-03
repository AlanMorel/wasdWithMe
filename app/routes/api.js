var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var query = req.query.q;
    console.log(query);
    res.type('text/plain');
    res.send(query);
});

module.exports = router;
