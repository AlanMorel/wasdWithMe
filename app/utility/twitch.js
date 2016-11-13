var config  = require('../config');
var unirest = require('unirest');

function loadChannel(twitch_username, callback){
    var api = {
        client_id: "?client_id=" + config.twitch_key
    };

    var request = config.twitch_channels + twitch_username + api.client_id;

    unirest
        .get(request)
        .header("Accept", "application/json")
        .timeout(config.timeout)
        .end(function (response) {
                //if something went wrong
                if (response.status != 200){
                    return;
                }
                callback(response.body);
            }
        );
}

module.exports = {
    loadChannel: loadChannel
};
