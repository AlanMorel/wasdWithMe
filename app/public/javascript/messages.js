var socket = io.connect();

var input = document.querySelector(".input");

var title = document.title;
var to = title.split(" ")[2].toLowerCase();

//sets the conversation of the last message as most recent
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

//set the form's onsubmit function
document.querySelector(".chat-form").onsubmit = function(e) {
    e.preventDefault();
    if (input.value.length == 0) {
        return;
    }
    sendMessage(input.value);
};

input.onkeyup = function() {
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
        console.log("message blocked");
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
    var append = "<div class='bubble'><span class='" + cssClass + "-message'>" + message + "</span></div>";
    appendText(append);
    sendTitleBlink(other);
}

//auto scroll implementation below
var chat = document.querySelector(".chat");
chat.scrollTop = chat.scrollHeight;

function appendText(append){
    chat.innerHTML = chat.innerHTML + append;
    chat.scrollTop = chat.scrollHeight;
}

//start of user is typing implementation below
var typing = document.querySelector(".typing");
var isTypingDisplayTime = 7000; //in milliseconds
var typingInterval;

socket.on('typing', function(data){
    if (data.from !== to){
        return;
    }
    showTyping();
});

//shows that the other user is typing
function showTyping(){

    //resets the countdown
    clearTimeout(typingInterval);

    //show the typing text
    typing.innerHTML = to + " is typing...";

    //set the timeout to clear the message
    typingInterval = setTimeout(function(){
        clearTyping();
    }, isTypingDisplayTime);
}

function clearTyping(){
    clearTimeout(typingInterval);
    typing.innerHTML = "";
}

//start of title blink implementation below
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
