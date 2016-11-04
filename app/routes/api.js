var router = require('express').Router();

var data   = require('../utility/data');
var helper = require('../utility/helper');
var config = require('../config');
var User   = require('../models/user');
var Game   = require('../models/game');

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

//handles one up requests
router.get('/oneup', function(req, res, next) {

    var id = req.query.id;
    var type = req.query.type;

    var model = getModelByType(type);

    //if not logged in or null model, return nothing
    if(!req.user || !model){
        res.send();
        return;
    }

    model.findById(id, "one_ups", function (err, object) {

        //if error or object not found, return nothing
        if (err || !object){
            res.send();
            return;
        }

        var index = helper.getOneUppedIndex(object.one_ups, req.user);
        console.log(index >= 0 ? "one upped, removing" : "not one upped, adding");

        //if oneUpped, remove it, otherwise push to array
        if (index >= 0){
            object.one_ups.splice(index, 1);
        } else {
            var oneUp = {
                one_upper: req.user.username
            };
            object.one_ups.push(oneUp);
        }

        //save the object back into the database and send response
        object.save(function(err) {
            if (err) {
                res.send();
                return;
            }
            res.send(JSON.stringify(index));
        });
    });
});

//get the model object by the type name
function getModelByType(type){
    if (type === "user"){
        return User;
    } else if (type === "game"){
        return Game;
    } else {
        return null;
    }
}

module.exports = router;
