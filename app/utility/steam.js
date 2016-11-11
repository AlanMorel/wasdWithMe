var config  = require('../config');
var unirest = require('unirest');

function loadUser(steamid, callback){
    var api = {
        key: "?key=" + config.steam_key,
        steamid: "&steamids="  + steamid
    };

    var request = config.steam_user + api.key + api.steamid;

    unirest
        .get(request)
        .header("Accept", "application/json")
        .timeout(config.timeout)
        .end(function (response) {
                //if something went wrong
                if (response.status != 200){
                    return;
                }
                callback(response.body.response.players[0]);
            }
        );
}

function loadGames(steamid, callback){
    var api = {
        key: "?key=" + config.steam_key,
        steamid: "&steamid="  + steamid,
        include_appinfo: "&include_appinfo=" + 1
    };

    var request = config.steam_games + api.key + api.steamid + api.include_appinfo;

    unirest
        .get(request)
        .header("Accept", "application/json")
        .timeout(config.timeout)
        .end(function (response) {
                //if something went wrong
                if (response.status != 200){
                    return;
                }
                callback(response.body.response);
            }
        );
}

module.exports = {
    loadUser: loadUser,
    loadGames: loadGames
};
