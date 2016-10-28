var socket = io.connect();
var form = document.querySelector(".chat-form");
var message = document.querySelector(".message");
var chat = document.querySelector(".chat");

var url = window.location.href;
var to = getTo(url);

function getTo(url){
    var index = url.indexOf('/messages/');
    if(index < 0){
        return null;
    } else {
        return url.substring(index + 10, url.length).replace('/','').toLowerCase();
    }
}

console.log(url);
console.log("User: " + to);

form.onsubmit = function(e){
    e.preventDefault();
    sendMessage(message.value);
};

function sendMessage(text){
    var data = {
        to: to,
        message: text
    };
    socket.emit('send message', data);
    message.value = "";
}

socket.on('new message', function(data){

    //if you're person A talking to person B,
    //but then person C messages you (person A),
    //we don't want to load C's message
    console.log(data.from);
    console.log(data.to);
    console.log(to);

    if (data.from !== to){
        console.log("message blocked");
        return;
    }

    var append = data.from + ": "  + data.message;
    chat.innerHTML = chat.innerHTML + (append + "<br/>");
});

socket.on('own message', function(data){
    console.log(data.from);
    console.log(data.to);
    console.log(to);

    if (data.to !== to){
        console.log("message blocked");
        return;
    }

    var append = data.from + ": "  + data.message;
    chat.innerHTML = chat.innerHTML + (append + "<br/>");
});
