var router = require('express').Router();

var Logger  = require('../utility/logger');
var alert   = require('../utility/alert');
var User    = require('../models/user');
var Message = require('../models/message');
var config  = require('../config');

//redirects to messages with the last person they talked to
router.get('/', function (req, res, next) {

    //query to search for sent messages to anybody
    var sent = {
        from: req.user.username
    };

    //query to search for received messages from anybody
    var received = {
        to: req.user.username
    };

    //query for all messages sent by you or sent to you
    var query = {
        $or: [sent, received]
    };

    Message.find(query).sort('-created_at').exec(function(err, messages) {

        if (err || !messages){
            Logger.log("Getting messages between " + req.user.username + " and " + to.username + " failed.", err);
            alert.send(req, res, "Messaging error!", "We could not find retrieve your messages.");
            return;
        }

        //if you have never messaged anybody
        if (messages.length == 0){
            alert.send(req, res, "No messages found.", "You don't have any messages yet. Head on over to somebody's page and message them! Any messages sent or received will be displayed here.");
            return;
        }

        var lastMessage = messages[0];
        var own = lastMessage.from === req.user.username;
        var otherUsername = own ? lastMessage.to : lastMessage.from;

        res.redirect('/messages/' + otherUsername);
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
            from: req.user.username
        };

        //query to search for received messages from anybody
        var received = {
            to: req.user.username
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
            var conversations = []; //holds all your conversations

            messages.forEach(function(message) {
                //true if it is your own message, false otherwise
                var own = message.from === req.user.username;

                //sets the username of the other person in the conversation
                var otherUsername = own ? message.to : message.from;

                //true if this message is from the conversation you are trying to access
                message.active = username === otherUsername;

                //updates this message's conversation as the most recent conversation
                updateMostRecentConversation(conversations, otherUsername, message);

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
                js: [config.socketio, "/javascript/messages"],
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
    //remove this conversation if it already exists
    var index = arrayObjectIndexOf(conversations, username, "name");
    if (index >= 0){
        conversations.splice(index, 1);
    }
    //push a new conversation object onto the array
    conversations.push({
        name: username,
        message: message.message,
        active: message.active
    });
    return conversations;
}

//returns the index of an object inside an array by the property
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm){
            return i;
        }
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
