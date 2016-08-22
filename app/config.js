var config = {};

//General
config.name = "wasdWithMe";
config.description = "wasdWithMe is the online destination to meet and play with gamers.";
config.siteUrl = "http://wasdWithMe.com";
config.favicon = "/favicon.ico";
config.keywords = "wasdWithMe, gaming";

//jQuery
config.jQueryUrl = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";

//Passport
config.passportSecret = 'passport_secret';

//MongoDB
config.database = './models/db.js';
config.mongooseUri = 'mongodb://localhost/app';

module.exports = config;
