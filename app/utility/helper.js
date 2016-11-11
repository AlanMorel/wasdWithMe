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

//returns list of game filtered by source
function getGames(list, source){
    var games = [];
    for (var i = 0; i < list.length; i++) {
        if (source !== list[i].source){
            continue;
        }
        var game = {
            name: list[i].name,
            uri: encodeURI(list[i].name)
        };
        if (source === "steam"){
            game.appid = list[i].steam.appid;
            game.img_logo_url = list[i].steam.img_logo_url;
            game.playtime_forever = list[i].playtime_forever;
        }
        games.push(game);
    }
    return games;
}

module.exports = {
    isOwner: isOwner,
    getAge: getAge,
    getCleanedGameName: getCleanedGameName,
    getOneUppedIndex: getOneUppedIndex,
    hasOneUpped: hasOneUpped,
    getGames: getGames
};
