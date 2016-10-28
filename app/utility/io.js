function run(io) {

    io.sockets.on("connection", function(socket) {
        var username = socket.request.session.passport.user;

        if (!username){
            console.log("User not logged in.");
            return;
        }

        console.log("Connection opened by " + username + ".");

        socket.on('send message', function (data) {
            console.log("received: " + data + " from " + username);
            io.sockets.emit('new message', username + ": " + data);
        });
    });
}

module.exports = {
    run: run
};
