var mongoose = require('mongoose');
var typeUrl  = require('mongoose-type-url');

var Schema = mongoose.Schema;
var url = mongoose.SchemaTypes.Url;

var userSchema = new Schema({
  username:    {type:String,  required:true, unique:true},
  password:    {type:String,  required:true},
  salt:        {type:String,  required:true},
  email:       {type:String,  required:true, unique:true},
  gender:      {type:Boolean, required:true}, //edit
  birthday:    {type:Date,    required:true},
  country:     {type:String,  required:true}, //edit
  state:       {type:String,  required:true}, //edit
  city:        {type:String,  required:true}, //edit
  first_name:  {type:String,  required:false},
  last_name:   {type:String,  required:false},
  bio:         {type:String,  required:false},
  top_games:   {type:String,  required:false}, //edit
  profile_pic: {type:String,  required:false}, //edit
  one_ups:     {type:Number,  default:0}, //edit
  //[images]:  {type:String,  required:false},
  steam:       {type:String,  required:false}, //edit
  xbox:        {type:String,  required:false}, //edit
  playstation: {type:String,  required:false}, //edit
  twitch:      {type:String,  required:false}, //edit
  coins:       {type:Number,  default:0},
  timestamp:   {type:Date,    default:Date.now},
  deleted:     {type:Boolean, default:0}
});

/*****************************************
*       Location schemas below
******************************************/

var countrySchema = new Schema({
  name: {type:String, required:true},
  flag: {type:String, required:true}
});

var stateSchema = new Schema({
  country_id: {type:countrySchema, required:true},
  name:       {type:String,        required:true},
});

var citySchema = new Schema({
  state_id: {type:stateSchema, required:true},
  name:     {type:String,      required:true},
});

/*****************************************
*       Platform accounts schemas below
******************************************/

var steamSchema = new Schema({
  user_id:   {type:userSchema, required:true},
  steam_key: {type:String,     required:true},
});

var xboxSchema = new Schema({
  user_id:  {type:userSchema, required:true},
  xbox_key: {type:String,     required:true},
});

var playstationSchema = new Schema({
  user_id:         {type:userSchema, required:true},
  playstation_key: {type:String,     required:true},
});

var twitchSchema = new Schema({
  user_id:    {type:userSchema, required:true},
  twitch_key: {type:String,     required:true},
});

/*****************************************
*       Miscellaneous schemas below
******************************************/

var oneUpTypeSchema = new Schema({
  oneup_type: {type:Number, required:true},
  name:       {type:String, required:true}
});

var oneUpSchema = new Schema({
  user_id:    {type:userSchema,      required:true},
  oneup_type: {type:oneUpTypeSchema, required:true},
  type_id:    {type:Number,          required:true}, //profile,image,comment,etc
  timestamp:  {type:Date,            default:Date.now}
});

var commentSchema = new Schema({
  commenter_id: {type:userSchema, required:true},
  comment:      {type:String,     required:true},
  timestamp:    {type:Date,       default:Date.now},
  one_ups:      [oneUpSchema],
  deleted:      {type:Boolean,    default:0}
});

var imageSchema = new Schema({
  caption:   {type:String,  required:false},
  image_url: {type:url,     required:true},
  comments:  [commentSchema],
  timestamp: {type:Date,    default:Date.now},
  one_ups:   [oneUpSchema],
  deleted:   {type:Boolean, default:0}
});

/*****************************************
*       Game related schemas below
******************************************/

var platformSchema = new Schema({
  name:     {type:String, required:true},
  logo_url: {type:url,    required:true}
});

var gameSchema = new Schema({
  name:         {type:String, required:true},
  release_date: {type:Date,   required:false},
  description:  {type:String, required:false},
  box_art_url:  {type:url,    required:true},
  platforms:    [platformSchema]
});

var gameOwnersSchema = new Schema({
  user_id: {type:userSchema, required:true},
  game_id: {type:gameSchema, required:true},
});

/*****************************************
*      message related schemas below below
******************************************/

var messageSchema = new Schema({
  sender_id:    {type:userSchema, required:true},
  recipient_id: {type:userSchema, required:true},
  message:      {type:String,     required:true},
  timestamp:    {type:Date,       default:Date.now},
  read:         {type:Boolean,    default:0}, //0=unread, 1=read
  deleted:      {type:Boolean,    default:0}, //0=undeleted,1=deleted
});

var blockedSchema = new Schema({
  blocked_id: {type:userSchema, required:true},
  blocker_id: {type:userSchema, required:true},
  timestamp:  {type:Date,       default:Date.now},
});

/*****************************************
*      Models and exports below
******************************************/

//creates model for schema
// var User        = mongoose.model('User',        userSchema);
var Country     = mongoose.model('Country',     countrySchema);
var State       = mongoose.model('State',       stateSchema);
var City        = mongoose.model('City',        citySchema);
var Steam       = mongoose.model('Steam',       steamSchema);
var Xbox        = mongoose.model('Xbox',        xboxSchema);
var Playstation = mongoose.model('Playstation', playstationSchema);
var Twitch      = mongoose.model('Twitch',      twitchSchema);
var Image       = mongoose.model('Image',       imageSchema);
var Comment     = mongoose.model('Comment',     commentSchema);
var OneUpType   = mongoose.model('OneUpType',   oneUpTypeSchema);
var OneUp       = mongoose.model('OneUp',       oneUpSchema);
var Platform    = mongoose.model('Platform',    platformSchema);
var Game        = mongoose.model('Game',        gameSchema);
var GameOwners  = mongoose.model('GameOwners',  gameOwnersSchema);
var Message     = mongoose.model('Message',     messageSchema);
var Blocked     = mongoose.model('Blocked',     blockedSchema);

//makes schema available for node applications
// module.exports = User;
module.exports = Country;
module.exports = State;
module.exports = City;
module.exports = Steam;
module.exports = Xbox;
module.exports = Playstation;
module.exports = Twitch;
module.exports = Image;
module.exports = Comment;
module.exports = OneUpType;
module.exports = OneUp;
module.exports = Platform;
module.exports = Game;
module.exports = GameOwners;
module.exports = Message;
module.exports = Blocked;
