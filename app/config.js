var config = {};

//General
config.name = "WASD With Me";
config.description = "WASD With Me is the online destination to meet and play with gamers.";
config.siteUrl = "http://wasdwithme.com";
config.favicon = "/favicon.ico";
config.keywords = "WASD, with, me, gaming, steam, xbox, psn, twitch";

//jQuery
config.jQueryUrl = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";

//Google Fonts
config.fonts = ['Open+Sans:300,400', 'Source+Sans+Pro:300,400', 'Roboto:300,400,900', 'Raleway:300,400,500'];

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

//Profile backgrounds
config.backgrounds = ["Default"];

//Validation constants
config.usernameMinLength = 4;
config.usernameMaxLength = 16;

config.passwordMinLength = 8;
config.passwordMaxLength = 32;

config.emailMinLength = 4;
config.emailMaxLength = 32;

config.nameMaxLength = 32;

config.taglineMaxLength = 50;

config.bioMaxLength = 500;

//Platform-specifics
config.steamNameMinLength = 0;
config.steamNameMaxLength = 0;

config.xboxGamertagMinLength = 0;
config.xboxGamertagMaxLength = 0;

config.psnIdMinLength = 0;
config.psnIdMaxLength = 0;

config.twitchNameMinLength = 0;
config.twitchNameMaxLength = 0;

//Google reCAPTCHA keys

config.recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
config.recaptcha_client = "6Lc0DA0UAAAAAEb4pF1KpW2m-qcgrNAWt7SAuqCh";
config.recaptcha_server = "6Lc0DA0UAAAAAIgkapv5J4wRakuC70TLLTaKN5zm";

//For all APIs
config.timeout = 1000;

//NewsAPI
config.newsapi_url = "https://newsapi.org/v1/articles";
config.newsapi_source = "polygon";
config.newsapi_key = "93eee0eb325d4e41aed95d186bbd1249";

//IGDB Api
config.igdb_url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/";
config.igdb_max_per_query = 50;
config.igdb_key = "JhLqNbheBFmshilJrKIbRedqpI2Ap1J6HWbjsnUI5CoGpvRbJg";

//Steam Api
config.steam_key = "CB0CD5EC671AEC6F5302974F52B3E9C1";
config.steam_games = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/";
config.steam_user = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";

//Twitch Api
config.twitch_key = "igcito337l7dfhoy6vgvc5tt3yaxsza";
config.twitch_channels = "https://api.twitch.tv/kraken/channels/";

//Other
config.game_not_found_boxart = "https://static-cdn.jtvnw.net/ttv-static/404_boxart-136x190.jpg";
config.results_per_page = 10;

//max number of most recent messages to load for chat
config.max_messages = 100;

//socket.io
config.socketio = "/socket.io/socket.io";
config.socketio_cdn = "https://cdn.socket.io/socket.io-1.4.5";

module.exports = config;
