var express = require('express');
var router = express.Router();

var User   = require('../models/user');

//You should not be able to access /search directly
router.get('/', function(req, res, next) {
    res.render('404', {
        title: 'wasdWithMe - Error!',
        layout: 'primary',
        file: '404',
        user : req.user,
        message: 'Error, can\'t access this page!!'
    });
});

router.post('/', function(req, res, next) {
    var query = req.body.query;
    query = query.toLowerCase();

    console.log("Search query: " + query);

    var mongooseQuery = {
        "username": {
            "$regex": query
        }
    };

    User.find(mongooseQuery, function(err,docs) {
            console.log(docs);
        }
    );

    res.render('search', {
        title: 'wasdWithMe - Search Results',
        layout: 'primary',
        file: 'search',
        user: req.user,
        query: query
    });
});

module.exports = router;
