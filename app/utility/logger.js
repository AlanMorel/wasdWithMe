var exports = module.exports = {};

exports.log = function(message, err){
    console.log(message);
    throw err;
    //In production, add to database
};
