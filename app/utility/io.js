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

            var toUsername = data.to.toLowerCase();
            var toSockets = users[toUsername];
            for (var i = 0; i < toSockets.length; i++){
                var toSocket = toSockets[i];
                if (toSocket) {
                    toSocket.emit('new message', data);
                } else {
                    //they are not online, maybe return here
                    console.log(toUsername + "'s socket not found");
                }
            }

            var fromSockets = users[username];
            for (var i = 0; i < fromSockets.length; i++){
                var fromSocket = fromSockets[i];
                fromSocket.emit('own message', data);
            }

            //socket.emit('new message', data);
            //io.sockets.emit('new message', data);
        });

        socket.on('disconnect', function(data){
            console.log("Connection closed by " + username + ".");
            removeSocket(username, socket);
        });
    });

    function addSocket(username, socket){
        var sockets = users[username];
        if (!sockets){
            sockets = [];
        }
        sockets.push(socket);
        users[username] = sockets;
        console.log("add: " + username + " has " + sockets.length + " sockets");
    }

    function removeSocket(username, socket){
        var sockets = users[username];
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);
       // delete sockets[socket];
        console.log("remove: " + username + " has " + sockets.length + " sockets");
    }
}

module.exports = {
    run: run
};
