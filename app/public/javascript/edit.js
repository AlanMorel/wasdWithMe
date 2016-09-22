var currentInput = null;
var subbox = document.querySelector("span.sub-results-box");
var gamesList = document.querySelector(".games-list");

//Searches for games whenever a key is pressed in any text input
var searchGame = function(){
    currentInput = this;
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState != 4 || request.status != 200 || request.responseText.length < 1){
            //If something went wrong or no results returned, hide box
            subbox.style.visibility = "hidden";
            subbox.style.display = "none";
            return;
        }

        //Move the result box to below this input
        currentInput.parentNode.insertBefore(subbox, currentInput.nextSibling);

        //Display results to the user
        subbox.innerHTML = request.responseText;
        subbox.style.visibility = "visible";
        subbox.style.display = "block";

        //Give each game an onclick event
        var children = subbox.childNodes;
        for(var child in children) {
            children[child].onclick = selectGame;
        }
    };

    request.open("GET", "/api/search?q=" + this.value, true);
    request.send();
};

//Selects a game whenever it is clicked
var selectGame = function(){
    //Set the text input to the clicked game's name
    var name = this.querySelector(".name").innerHTML;
    currentInput.value = name;
    currentInput.readOnly = true;

    //Hide the box since game selection was made
    subbox.style.visibility = "hidden";
    subbox.style.display = "none";
    return false;
};

//deletes game when button is pressed
var deleteGame = function(button){
    if (button.target) {
        button = button.target;
    }

    gamesList.removeChild(button.previousSibling);
    gamesList.removeChild(button);
};

//Add a new game input when the button is clicked
document.querySelector(".add-another").onclick = function() {
    var input = document.createElement("input");
    input.type = "text";
    input.className = "input-game";
    input.name = "games";
    input.onkeyup = searchGame;

    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = "Remove Game";
    button.onclick = deleteGame;

    gamesList.appendChild(input);
    gamesList.appendChild(button);
};

//Start the upload process when the pic is clicked
document.querySelector(".pic").onclick = function() {
    document.querySelector(".image-upload").click();
};

//Preview the image when selected
document.querySelector(".image-upload").onchange = function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        document.querySelector(".profile-pic").src = e.target.result;
    };

    reader.readAsDataURL(this.files[0]);
};
