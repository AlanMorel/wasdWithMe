var socket = io.connect();
var form = document.querySelector(".chat-form");
var message = document.querySelector(".message");
var chat = document.querySelector(".chat");

form.onsubmit = function(e){
    e.preventDefault();
    socket.emit('send message', message.value);
    console.log("sent: " + message.value);
    message.value = "";
};

socket.on('new message', function(data){
    chat.innerHTML = chat.innerHTML + (data + "<br/>");
});
