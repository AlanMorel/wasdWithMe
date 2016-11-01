var Message = require('../models/message');
var Logger  = require('../utility/logger');

//cache of usernames to sockets array
var users = {};

function run(io) {

    io.sockets.on("connection", function(socket) {
        var username = socket.request.session.passport.user;

        if (!username){
            console.log("User not logged in, so do nothing.");
            return;
        }

        console.log("Socket opened by " + username + ".");
        addSocket(username, socket);

        socket.on('send message', function (data) {
            //set the data's from field
            data.from = username;

            //user where this message is heading to
            var toUsername = data.to.toLowerCase();

            //save message to database
            saveMessage(username, toUsername, data.message);

            //broadcast message to yourself and recipient
            broadcast(username, "own message", data);
            broadcast(toUsername, "new message", data);
        });

        socket.on('disconnect', function(data){
            console.log("Socket closed by " + username + ".");
            removeSocket(username, socket);
        });

        socket.on('typing', function(data){
            data.from = username;
            broadcast(data.to.toLowerCase(), "typing", data);
        });
    });
}

//broadcasts data with an action tied to it to username
function broadcast(username, action, data){
    //get user's sockets
    var sockets = users[username];

    //if there are none, they are currently offline, don't emit message
    if(!sockets || sockets.length == 0){
        return;
    }

    //they are online, emit data to them
    for (var i = 0; i < sockets.length; i++){
        sockets[i].emit(action, data);
    }
}

//adds a socket to a user's sockets array
function addSocket(username, socket){
    var sockets = users[username];
    if (!sockets){
        sockets = [];
    }
    sockets.push(socket);
    users[username] = sockets;
}

//removes a socket from a user's sockets array
function removeSocket(username, socket){
    var sockets = users[username];
    var index = sockets.indexOf(socket);
    sockets.splice(index, 1);
}

//saves a message to the database
function saveMessage(from, to, message){
    //build the message object
    var message = new Message({
        from: from,
        to: to,
        message: message
    });

    //save message to database
    message.save(function (err) {
        if (err) {
            Logger.log("Message from " + from + " to " + to + " was unable to be saved.", err);
        }
    });
}

module.exports = {
    run: run
};
