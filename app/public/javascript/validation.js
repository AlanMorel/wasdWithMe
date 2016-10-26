//returns error message for out of range text lengths
function lengthErrorMessage(data, min, max) {
    return "Your " + data + " must be " + min + " to " + max + " characters long.";
}

//returns true if the text is within the size specified
function checkSize(text, min, max) {
    return text.length < min || text.length > max;
}

function validateUsername(text) {
    if (checkSize(text, 4, 16)){
        return lengthErrorMessage("username", 4, 16);
    }
    return "";
}

function validatePassword(text) {
    if (checkSize(text, 8, 32)){
        return lengthErrorMessage("password", 8, 32);
    }
    return "";
}

function validateConfirmation(text, password) {
    if (text !== password) {
        return "The two passwords entered do not match.";
    }
    return "";
}

function validateEmail(text) {
    if (checkSize(text, 4, 32)){
        return lengthErrorMessage("email", 4, 32);
    }
    if (!emailIsValid(text)){
        return "The email entered is not valid."
    }
    return "";
}

function emailIsValid(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function validateDate(date){

    //today's date minus 13 years
    var max = new Date(date);
    max.setFullYear(new Date().getFullYear() - 13);

    //Jan 1, 1990
    var min = new Date(1900,0,1);

    //user's birthday
    var birthday = new Date(date);

    if (max < birthday){
        return "You must be at least 13 years old to register an account."
    }

    if (min > birthday){
        return "Please enter a valid date of birth."
    }

    return "";
}
