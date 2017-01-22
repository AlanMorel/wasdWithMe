var socket = io();

var input = document.querySelector(".input");

var title = document.title;
var to = title.split(" ")[2].toLowerCase();

//set the form's onsubmit function
document.querySelector(".chat-form").onsubmit = function(e) {
    e.preventDefault();

    //ignore empty inputs
    if (input.value.length == 0) {
        return;
    }

    sendMessage(input.value);
};

//sends typing info to server when key is pressed
input.onkeyup = function() {

    //ignore empty inputs
    if (input.value.length == 0){
        return;
    }

    var data = {
        to: to
    };

    socket.emit('typing', data);
};

socket.on('new message', function(data){
    updateConversation(data, data.from);

    //if you're person A talking to person B,
    //but then person C messages you (person A),
    //we don't want to load C's message

    if (data.from !== to){
        return;
    }

    clearTyping();
    addMessage(data.from, data.message);
});

socket.on('own message', function(data){
    updateConversation(data, data.to);

    //this prevents your own message from
    //appearing in your other chats

    if (data.to !== to){
        return;
    }

    addMessage(data.from, data.message);
});

//emits a message to the server and clears the input
function sendMessage(text){
    var data = {
        to: to,
        message: text
    };
    socket.emit('send message', data);
    input.value = "";
}

//appends text to chat and blinks title if needed
function addMessage(from, message){
    var other = from === to;
    var cssClass = other ? "other" : "own";
    var append = "<div class='bubble'><span class='" + cssClass + "-message'>" + message + "</span></div>";
    appendText(append);
    sendTitleBlink(other);
}

//moves the conversation of the last message to the top
function updateConversation(data, otherUsername){
    var toUpdate = getConversationByUsername(otherUsername);
    var conversations = document.querySelector(".conversations");
    toUpdate.querySelector(".conversation-snippet").innerHTML = data.message;
    conversations.appendChild(toUpdate);
    conversations.insertBefore(toUpdate, conversations.firstChild);
}

//returns the conversation node given a username
function getConversationByUsername(username){
    var conversations = document.querySelectorAll(".conversation-username");
    for (var i = 0; i < conversations.length; i++){
        if (conversations[i].innerHTML === username){
            return conversations[i].parentElement.parentElement.parentElement;
        }
    }
}

//auto scroll implementation below
var chat = document.querySelector(".chat");
chat.scrollTop = chat.scrollHeight;

function appendText(append){
    chat.innerHTML += append;
    chat.scrollTop = chat.scrollHeight;
}

//user is typing implementation below
var typing = document.querySelector(".typing");
var isTypingDuration = 10; //how long to display "is typing" in seconds
var typingInterval;

socket.on('typing', function(data){

    //if this refers to another conversation, do nothing
    if (data.from !== to){
        return;
    }

    //resets the countdown
    clearTimeout(typingInterval);

    //show the typing text
    typing.innerHTML = to + " is typing...";

    //set the timeout to clear it
    typingInterval = setTimeout(function(){
        clearTyping();
    }, isTypingDuration * 1000);
});

function clearTyping(){
    clearTimeout(typingInterval);
    typing.innerHTML = "";
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
