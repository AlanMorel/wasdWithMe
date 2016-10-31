var router = require('express').Router();

var Logger  = require('../utility/logger');
var alert   = require('../utility/alert');
var User    = require('../models/user');
var Message = require('../models/message');
var config  = require('../config');

//handles get request for all messages
router.get('/', function (req, res, next) {

    //redirect to last chat

    res.render('message', {
        title: 'All Messages',
        layout: 'primary',
        file: 'message',
        user: req.user,
        js: ["/socket.io/socket.io", "/javascript/messages"]
    });
});

//handles GET requests to /message/username
router.get('/:username', function (req, res, next) {

    if (!req.user){
        alert.send(req, res, "Please log in.", "You must log in to message others.");
        return;
    }

    var username = req.params.username.toLowerCase();

    //to prevent people from trying to message themselves
    if (req.user.username === username){
        alert.send(req, res, "You cannot message yourself.", "You cannot message yourself.");
        return;
    }

    User.findByUsername(username, true, function(err, to) {

        //if error or user not found, return
        if (err || !to){
            alert.send(req, res, "User not found!", "We could not find any user named'" + username + "'.");
            return;
        }

        //query to search for sent messages to anybody
        var sent = {
            from: req.user.username.toLowerCase()
        };

        //query to search for received messages from anybody
        var received = {
            to: req.user.username.toLowerCase()
        };

        //query for all messages sent by you or sent to you
        var query = {
            $or: [sent, received]
        };

        Message.find(query).sort('created_at').exec(function(err, messages) {

            if (err || !messages){
                Logger.log("Getting messages between " + req.user.username + " and " + to.username + " failed.", err);
                alert.send(req, res, "Messaging error!", "We could not find retrieve your messages.");
                return;
            }

            var chat = []; //holds the messages to display in this chat
            var conversations = []; //holds your most recent conversations

            //set whether they are own or message from another person
            messages.forEach(function(message) {
                var own = message.from === req.user.username;
                var otherUsername = own ? message.to : message.from;

                updateMostRecentConversation(conversations, otherUsername, message.message);

                //if it belongs in this chat, set css class and push to the chat array
                if (otherUsername === username){
                    message.css = own ? "own" : "other";
                    chat.push(message);
                }
            });

            //limit the number of messages we send to the user
            chat = chat.slice(-config.max_messages);

            //reverse the conversations order so it can be displayed properly
            conversations = conversations.reverse();

            res.render('message', {
                title: 'Messages with ' + username,
                layout: 'primary',
                file: 'message',
                user: req.user,
                js: ["/socket.io/socket.io", "/javascript/messages"],
                to: to,
                gender: config.gender[to.gender],
                age: getAge(to.birthday),
                chat: chat,
                conversations: conversations
            });
        });
    });
});

//sets the conversation as the current most recent conversation
function updateMostRecentConversation(conversations, username, message){
    var index = arrayObjectIndexOf(conversations, username, "name");
    if (index >= 0){
        conversations.splice(index, 1);
    }
    //push a new conversation object onto the array
    conversations.push({
        name: username,
        message: message
    });
    return conversations;
}

//returns the index of an object inside an array
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

//returns age of user in years
function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    return Math.floor(difference / year);
}

module.exports = router;
