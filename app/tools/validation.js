var config   = require('../config');
var exports = module.exports = {};

//checkAccount should instead return string with error
//no error returns empty string
//if checkAccount, then set it
exports.checkAccount = function(username, password, email) {

    if (username === '') {
        return "No username inputted";
    }
    //check username first
    if (!usernameIsValid(username)) {
        return "Only alphanumerical, numerical, dashes and underscores allowed in username";
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
      return "Password not valid must contain at least one alphanumeric character and one numeric character";
    }

    //check email field if valid
    if (email === '') {
        return "Email address not entered";
    }

    if(email.length < config.emailMinLength || email.length > config.emailMaxLength){
      return "Email length not between "+config.emailMinLength+" and "+config.emailMaxLength+" characters";
    }

    if (!emailIsValid(email)) {
        return "Email address entered not valid";
    }

    return undefined;
}


//slugs title by replacing spaces with dashes, removing all symbols, removes a sequence of dashes,
//disallows a dash from start or end of slug
//@return: Returns undefeined if cannot be slugged
exports.slugTitle = function(title){
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') .replace(/^-+/, '').replace(/-+$/, '')
  || undefined;
}

exports.slugUser = function(username){
  if(usernameIsValid(username)){
    return slugTitle(username);
  }
  else{
    return undefined;
  }
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
