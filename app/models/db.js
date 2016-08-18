var mongoose    = require('mongoose');
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



//creates model for schema
var User      =   mongoose.model('User',userSchema);

//makes schema available for node applications
module.exports=   User;
