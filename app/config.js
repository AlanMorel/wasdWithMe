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
config.mongooseUri = 'mongodb://localhost/app';

//User Schema
config.usernameMinLength = 3;
config.usernameMaxLength = 32;

config.passwordMinLength = 8;
config.passwordMaxLength = 32;

config.emailMinLength = 3;
config.emailMaxLength = 64;

config.nameMaxLength = 32;

config.bioMaxLength = 500;

config.topGamesLength = 5;

//Platform-specific
config.steamNameMinLength = 0;
config.steamNameMaxLength = 0;

config.xboxGamertagMinLength = 0;
config.xboxGamertagMaxLength = 0;

config.psnIdMinLength = 0;
config.psnIdMaxLength = 0;

config.twitchNameMinLength = 0;
config.twitchNameMaxLength = 0;

module.exports = config;
