var mongoose    = require('mongoose');
require('mongoose-type-url'); //introduces url as type
var Schema      = mongoose.Schema;

var userSchema = new Schema({
  username:   {type: String, required:true, unique:true},
  password:   {type: String, required:true},
  email:      {type: String, required:true, unique:true},
  first_name: {type:String, required:true},
  last_name:  {type:String, required:true},
  gender:     {type:Boolean, required:true}, //edit
  birth_date: {type:Date, required:true},
  country:    {type:String, required:true}, //edit
  state:      {type:String, required:true}, //edit
  city:       {type:String, required:true}, //edit
  one_ups:    {type:Number, default:0}, //edit
  bio:        {type:String, required:false},
  top_games:  {type:String, required:true}, //edit
  profile_image:{type:String, required:false}, //edit
  //[images]:     {type:String, required:false},
  steam_acc:  {type:String, required:false}, //edit
  xb_acc:     {type:String, required:false}, //edit
  ps_acc:     {type:String, required:false}, //edit
  twitch_acc: {type:String, required:false}, //edit
  coins:      {type:Number, default:0},
  timestamp:  {type:Date, default:Date.now},
  deleted:    {type:Boolean, default:0}
});

/*****************************************
*       Geolocation schemas below
******************************************/

var countrySchema   =   new Schema({
  name: {type:String, required:true},
  flag: {type:String, required:true}
});

var stateSchema   =   new Schema({
  country_id: {type:countrySchema, required:true},
  name: {type:String, required:true},
});

var citySchema   =   new Schema({
  state_id: {type:stateSchema, required:true},
  name: {type:String, required:true},
});

/*****************************************
*       Game accounts schema below
******************************************/

var steamSchema   =   new Schema({
  user_id: {type:userSchema, required:true},
  steam_key: {type:String, required:true},
});

var xboxSchema   =   new Schema({
  user_id: {type:userSchema, required:true},
  xbox_key: {type:String, required:true},
});

var psnSchema   =   new Schema({
  user_id: {type:userSchema, required:true},
  psn_key: {type:String, required:true},
});

var twitchSchema   =   new Schema({
  user_id: {type:userSchema, required:true},
  twitch_key: {type:String, required:true},
});


/*****************************************
*       Miscellaneous schemas below
******************************************/

var imageSchema   =   new Schema({
  caption:      {type:String,required:false},
  image_url:    {type:mongoose.SchemaTypes.Url,required:true},
  //[comments]
  timestamp:    {type:Date, default:Date.now},
  //[one_ups]
  deleted:      {type:Boolean, default:0}
});


/*****************************************
*      Models and exports below
******************************************/

//creates model for schema
var User      =     mongoose.model('User',userSchema);
var Country   =     mongoose.model('Country',countrySchema);
var State     =     mongoose.model('State',stateSchema);
var City      =     mongoose.model('City',citySchema);
var Steam     =     mongoose.model('Steam',steamSchema);
var Xbox      =     mongoose.model('Xbox',xboxSchema);
var Psn       =     mongoose.model('Psn',psnSchema);
var Twitch    =     mongoose.model('Twitch',twitchSchema);
var Image     =     mongoose.model('Image',imageSchema);

//makes schema available for node applications
module.exports=       User;
module.exports=       Country;
module.exports=       State;
module.exports=       City;
module.exports=       Steam;
module.exports=       Xbox;
module.exports=       Psn;
module.exports=       Twitch;
module.exports=       Image;
