var exports = module.exports = {};

exports.log = function(message, err){
    Console.log(message);
    Console.log(err);
    //In production, add to database
};
