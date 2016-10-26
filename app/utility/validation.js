var config  = require('../config');
var exports = module.exports = {};

//returns undefined if no error occurs
exports.checkAccount = function(username, password, confirmation, email) {

    //ensure a username was entered
    if (username === '') {
        return "Username not entered.";
    }

    //ensure correct username length
    if (username.length < config.usernameMinLength || username.length > config.usernameMaxLength) {
        return "Username must be between " + config.usernameMinLength+ " and " + config.usernameMaxLength + " characters in length.";
    }

    //check username validity
    if (!usernameIsValid(username)) {
        return "Usernames may only contain letters, numbers, dashes and underscores.";
    }

    //check password was entered
    if (password === '') {
        return "You must input a password.";
    }

    //ensure correct password length
    if (password.length < config.passwordMinLength || password.length > config.passwordMaxLength) {
        return "Passwords must be between " + config.passwordMinLength + " and " + config.passwordMaxLength + " characters in length.";
    }

    //check password validity
    if(!passwordIsValid(password)){
      return "Your password must contain at least one letter and one number.";
    }

    //ensure both passwords entered match
    if (password !== confirmation){
        return "The two passwords entered do not match.";
    }

    //ensure email entered
    if (email === '') {
        return "Email address not entered.";
    }

    //ensure correct email length
    if(email.length < config.emailMinLength || email.length > config.emailMaxLength){
      return "Email length not between " + config.emailMinLength + " and " + config.emailMaxLength + " characters.";
    }

    //ensure email validity
    if (!emailIsValid(email)) {
        return "Please provide a valid email address.";
    }

    //no errors to return
    return undefined;
};

//slugs title by replacing spaces with dashes, removing all symbols, removes a sequence of dashes,
//disallows a dash from start or end of slug
//@return: Returns undefined if cannot be slugged
exports.slugTitle = function(title){
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') .replace(/^-+/, '').replace(/-+$/, '') || undefined;
};

exports.slugUser = function(username){
  if(usernameIsValid(username)){
      return slugTitle(username);
  } else {
      return undefined;
  }
};

//regex operation ensures first character is an alphanumeric
function usernameIsValid(username) {
    return /^[a-zA-z][0-9a-zA-Z_-]+$/.test(username);
}

//regex operation ensures a valid email
function emailIsValid(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

//regex operation ensures at least 1 alpha and 1 numeric
function passwordIsValid(password){
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}
