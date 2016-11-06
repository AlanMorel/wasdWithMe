var feedback = document.querySelector(".feedback");
var username = document.querySelector('input[name="username"]');
var password = document.querySelector('input[name="password"]');
var confirmation = document.querySelector('input[name="confirmation"]');
var email = document.querySelector('input[name="email"]');
var date = document.querySelector('input[name="date_of_birth"]');

username.addEventListener("focusout", function(){
    feedback.innerHTML = validateUsername(this.value);
});

password.addEventListener("focusout", function(){
    feedback.innerHTML = validatePassword(this.value);
});

confirmation.addEventListener("focusout", function(){
    feedback.innerHTML = validateConfirmation(this.value, password.value);
});

email.addEventListener("focusout", function(){
    feedback.innerHTML = validateEmail(this.value);
});

date.addEventListener("focusout", function(){
    feedback.innerHTML = validateDate(this.value);
});

//default date of birth to today's date
date.valueAsDate = new Date();

function validate() {
    return feedback.innerHTML.length == 0;
}
