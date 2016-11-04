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

//returns the index that the one up exists in the array
function getOneUppedIndex(oneUps, oneUpper){
    if (!oneUps || !oneUpper){
        return -1;
    }
    for (var i = 0; i < oneUps.length; i++){
        if (oneUps[i].one_upper === oneUpper.username){
            return i;
        }
    }
    return -1;
}

//returns whether or not user has oneUpped this object
function hasOneUpped(oneUps, oneUpper){
    return getOneUppedIndex(oneUps, oneUpper) >= 0;
}

module.exports = {
    isOwner: isOwner,
    getAge: getAge,
    getCleanedGameName: getCleanedGameName,
    getOneUppedIndex: getOneUppedIndex,
    hasOneUpped: hasOneUpped
};
