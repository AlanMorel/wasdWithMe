//returns true if user is on own page
function isOwner(user, owner){
    return user && user.username === owner.username;
}

//returns age of user in years
function getAge(birthday){
    var difference = new Date() - new Date(birthday);
    var year = 1000 * 60 * 60 * 24 * 365;
    return Math.floor(difference / year);
}

//cleans game name of edge case characters
function getCleanedGameName(name){
    var name = name
        .toLowerCase()
        .replace('é', 'e')
        .replace('&', 'and');
    return name;
}

module.exports = {
    isOwner: isOwner,
    getAge: getAge,
    getCleanedGameName: getCleanedGameName
};
