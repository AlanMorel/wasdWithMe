var config  = require('../config');
var exports = module.exports = {};

//returns undefined if no error occurs
exports.checkAccount = function(username, password, confirmation, email) {

    if (username === '') {
        return "Username not entered";
    }
    //check username first
    if (!usernameIsValid(username)) {
        return "Usernames may only contain letters, numbers, dashes and underscores";
    }

    if (username.length < config.usernameMinLength || username.length > config.usernameMaxLength) {
        return "Username must be between " + config.usernameMinLength+ " and " + config.usernameMaxLength + " characters in length";
    }

    //check password field valid next
    if (password === '') {
        return "You must input a password";
    }

    if (password.length < config.passwordMinLength || password.length > config.passwordMaxLength) {
        return "Passwords must be between " + config.passwordMinLength + " and " + config.passwordMaxLength + " characters in length";
    }

    if(!passwordIsValid(password)){
      return "Your password must contain at least one letter and one number";
    }

    if (password !== confirmation){
        return "The two passwords entered do not match.";
    }

    //check email field if valid
    if (email === '') {
        return "Email address not entered";
    }

    if(email.length < config.emailMinLength || email.length > config.emailMaxLength){
      return "Email length not between " + config.emailMinLength + " and " + config.emailMaxLength + " characters";
    }

    if (!emailIsValid(email)) {
        return "Please provide a valid email address";
    }

    return undefined;
}

//slugs title by replacing spaces with dashes, removing all symbols, removes a sequence of dashes,
//disallows a dash from start or end of slug
//@return: Returns undefeined if cannot be slugged
exports.slugTitle = function(title){
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') .replace(/^-+/, '').replace(/-+$/, '') || undefined;
}

exports.slugUser = function(username){
  if(usernameIsValid(username)){
    return slugTitle(username);
  }
  return undefined;
}

/*
 Regex operation ensures first character is an alphanumeric
 */
function usernameIsValid(username) {
    return /^[a-zA-z][0-9a-zA-Z_-]+$/.test(username);
}

function emailIsValid(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

//requires 1 alphanumeric and 1 numeric
function passwordIsValid(password){
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}
