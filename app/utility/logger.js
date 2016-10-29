function log(message, err){
    console.log(message);
    throw err;
    //in production, add it to database
}

module.exports = {
    log: log
};
