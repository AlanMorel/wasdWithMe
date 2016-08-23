var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    username:    {type:String,  required:true, unique:true}, //3 min 32 max
    password:    {type:String,  required:true}, //8 to 32 min max
    salt:        {type:String,  required:true},
    email:       {type:String,  required:true, unique:true}, //3 min 64 max
    gender:      {type:Number, required:true},
    birthday:    {type:Date,    required:true},
    //location: country, state, city
    country:     {type:String,  required:true},
    state:       {type:String,  required:true},
    city:        {type:String,  required:true},
    first_name:  {type:String,  required:false}, //max 32
    last_name:   {type:String,  required:false}, //max 32
    //[profile]: bio, top_games, profile_pic, one_ups, images
    bio:         {type:String,  required:false}, //max 500
    top_games:   {type:String,  required:false},//max 5 array of ids 
    profile_pic: {type:String,  required:false},
    one_ups:     {type:Number,  default:0},
    //[images]:  {type:String,  required:false},
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
