var express = require('express');
var router = express.Router();

var data   = require('../utility/data');
var config = require('../config');

//handles search results
router.get('/', function (req, res, next) {
    var query = req.query.query;
    var type = req.query.type;
    var page = req.query.page ? req.query.page : 1;

    var users = type === "all" || type === "users";
    var games = type === "all" || type === "games";
    var searchRequest = data.makeSearchRequest(query, page, users, games);

    data.search(searchRequest, req, res, sendResults);
});

//renders the search results
var sendResults = function(req, res, searchRequest, results) {

    var pagination = getPagination(searchRequest, results);

    //slice the results so we only display what we need
    var lower = (searchRequest.page - 1) * config.results_per_page;
    var upper = lower + config.results_per_page;
    results = results.slice(lower, upper);

    if (results.length < 1){
        return emptySearchResults(req, res, searchRequest.query);
    }

    res.render('search', {
        title: 'Search Results',
        layout: 'primary',
        file: 'search',
        user: req.user,
        query: searchRequest.query,
        type: getType(searchRequest),
        results: results,
        pages: pagination
    });
};

function getType(searchRequest){
    if (searchRequest.games && searchRequest.users){
        return "all";
    } else if (searchRequest.users){
        return "users";
    } else if (searchRequest.games){
        return "games";
    }
}

function getPagination(searchRequest, results){
    var total = results.length / config.results_per_page; //total number of pages
    var pages = [];
    for (var i = 1; i <= total; i++){
        var page = {
            page_id: i,
            current: i == searchRequest.page
        };
        pages.push(page);
    }
    return pages;
}

function emptySearchResults(req, res, query){
    res.status(404);
    res.render('404', {
        title: 'Empty search results',
        layout: 'primary',
        file: '404',
        user: req.user,
        message: "We did not find any results for '" + query + "'."
    });
}

module.exports = router;
