var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username:    {type:String,  required:true, unique:true},
    password:    {type:String,  required:true},
    salt:        {type:String,  required:true},
    email:       {type:String,  required:true, unique:true},
    gender:      {type:Boolean, required:true},
    birthday:    {type:Date,    required:true},
    //location: country, state, city
    country:     {type:String,  required:true},
    state:       {type:String,  required:true},
    city:        {type:String,  required:true},
    first_name:  {type:String,  required:false},
    last_name:   {type:String,  required:false},
    bio:         {type:String,  required:false},
    top_games:   {type:String,  required:false},
    profile_pic: {type:String,  required:false},
    one_ups:     {type:Number,  default:0},
    //[images]:  {type:String,  required:false},
    //account steam, xbox, playstation, twitch etc
    steam:       {type:String,  required:false},
    xbox:        {type:String,  required:false},
    playstation: {type:String,  required:false},
    twitch:      {type:String,  required:false},
    coins:       {type:Number,  default:0},
    timestamp:   {type:Date,    default:Date.now},
    deleted:     {type:Boolean, default:0}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
