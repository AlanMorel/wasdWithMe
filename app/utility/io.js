var users = {};

function run(io) {

    io.sockets.on("connection", function(socket) {
        var username = socket.request.session.passport.user;

        if (!username){
            console.log("User not logged in.");
            return;
        }

        console.log("Connection opened by " + username + ".");

        addSocket(username, socket);

        socket.on('send message', function (data) {
            console.log("received: " + data + " from " + username);

            data.from = username;

            //send message back to yourself
            var fromSockets = users[username];
            for (var i = 0; i < fromSockets.length; i++){
                var fromSocket = fromSockets[i];
                fromSocket.emit('own message', data);
            }

            //send message to recipient's sockets
            var toUsername = data.to.toLowerCase();
            var toSockets = users[toUsername];

            if(!toSockets || toSockets.length == 0){
                //the recipient is offline
                return;
            }

            for (var i = 0; i < toSockets.length; i++){
                var toSocket = toSockets[i];
                toSocket.emit('new message', data);
            }
        });

        socket.on('disconnect', function(data){
            console.log("Connection closed by " + username + ".");
            removeSocket(username, socket);
        });
    });

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
}

module.exports = {
    run: run
};
