var feedback = document.querySelector(".feedback");
var username = document.querySelector('input[name="username"]');
var password = document.querySelector('input[name="password"]');

username.addEventListener("focusout", function(){
    feedback.innerHTML = validateUsername(this.value);
});

password.addEventListener("focusout", function(){
    feedback.innerHTML = validatePassword(this.value);
});

function validate() {
    return feedback.innerHTML.length == 0;
}
