var exports = module.exports = {};

exports.log = function(message, err){
    console.log(message);
    throw err;
    //in production, add it to database
};
