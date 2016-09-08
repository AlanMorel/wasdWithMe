var config = {};

//General
config.name = "wasdWithMe";
config.description = "wasdWithMe is the online destination to meet and play with gamers.";
config.siteUrl = "http://wasdWithMe.com";
config.favicon = "/favicon.ico";
config.keywords = "wasdWithMe, gaming";

//jQuery
config.jQueryUrl = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";

//Google Fonts
config.fonts = ['Open+Sans:300,400', 'Source+Sans+Pro:300,400', 'Roboto:300,400', 'Raleway:300,400,500'];

//Passport
config.passportSecret = 'passport_secret';

//MongoDB
config.mongooseUri = 'mongodb://localhost/app';

//User Schema
config.gender = {
    0: "Male",
    1: "Female",
    2: "Other"
};

config.usernameMinLength = 4;
config.usernameMaxLength = 16;

config.passwordMinLength = 8;
config.passwordMaxLength = 32;

config.emailMinLength = 4;
config.emailMaxLength = 32;

config.nameMaxLength = 32;

config.taglineMaxLength = 50;

config.bioMaxLength = 500;

config.favGamesLength = 5;

//Platform-specific
config.steamNameMinLength = 0;
config.steamNameMaxLength = 0;

config.xboxGamertagMinLength = 0;
config.xboxGamertagMaxLength = 0;

config.psnIdMinLength = 0;
config.psnIdMaxLength = 0;

config.twitchNameMinLength = 0;
config.twitchNameMaxLength = 0;

//IGDB Api
config.api_url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/";

//Usually cause for concern to have this open to the public but given that the key
//is free to obtain, I'm not concerned about unauthorized usage for now
config.api_key = "JhLqNbheBFmshilJrKIbRedqpI2Ap1J6HWbjsnUI5CoGpvRbJg";

module.exports = config;
