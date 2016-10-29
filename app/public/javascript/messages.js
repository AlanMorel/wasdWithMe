var socket = io.connect();

var form = document.querySelector(".chat-form");
var input = document.querySelector(".input");
var chat = document.querySelector(".chat");

var title = document.title;
var to = title.split(" ")[2].toLowerCase();

//auto scroll chat down
var originalHeight = chat.scrollHeight;
chat.scrollTop = originalHeight;

form.onsubmit = function(e){
    e.preventDefault();
    sendMessage(input.value);
};

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

function sendMessage(text){
    var data = {
        to: to,
        message: text
    };
    socket.emit('send message', data);
    input.value = "";
}

function addMessage(from, message){
    var other = from === to;
    var cssClass = other ? "other" : "own";
    var append = "<div class='bubble'><span class='" + cssClass + "-message'>" + from + ": "  + message + "</span></div>";
    appendText(other, append);
    sendTitleBlink(other);
}

function appendText(other, append){

    //if you sent the message or you're already at the bottom, auto-scroll down
    var scrollDown = !other || chat.scrollTop - chat.scrollHeight >= -originalHeight;

    chat.innerHTML = chat.innerHTML + append;

    if (scrollDown){
        chat.scrollTop = chat.scrollHeight;
    }
}

//title blink implementation below

var blink = null;
var blinkBoolean = true;

function sendTitleBlink(other) {
    //blink only if not your own message, the tab is not active and is not already blinking
    var shouldBlink = other && document.visibilityState !== 'visible' && blink == null;
    if (shouldBlink){
        blink = setInterval(changeTitle, 1000);
    }
}

window.onfocus = function() {
    clearInterval(blink);
    blink = null;
    document.title = title;
};

function changeTitle() {
    document.title = blinkBoolean ? "New Message from " + to + "!" : title;
    blinkBoolean = !blinkBoolean;
}
