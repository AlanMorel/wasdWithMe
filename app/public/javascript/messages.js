var socket = io.connect();
var form = document.querySelector(".chat-form");
var input = document.querySelector(".input");
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
    sendMessage(input.value);
};

function sendMessage(text){
    var data = {
        to: to,
        message: text
    };
    socket.emit('send message', data);
    input.value = "";
}

socket.on('new message', function(data){

    //if you're person A talking to person B,
    //but then person C messages you (person A),
    //we don't want to load C's message

    if (data.from !== to){
        console.log("message blocked");
        return;
    }

    addMessage(data.from, data.message);
});

socket.on('own message', function(data){

    //this prevents your own message from
    //appearing in your other chats

    if (data.to !== to){
        console.log("message blocked");
        return;
    }

    addMessage(data.from, data.message);
});

function addMessage(from, message){
    var other = from === to;
    var cssClass = other ? "other-message" : "own-message";
    var append = "<div class='" + cssClass + "'>" + from + ": "  + message + "</div>";
    chat.innerHTML = chat.innerHTML + append;
}
