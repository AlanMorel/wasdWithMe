var currentInput = null;
var subbox = document.querySelector("span.sub-results-box");
var gamesList = document.querySelector(".games-list");

//returns true if box should be shown, false if not
function shouldShow(query){
    return query && query.length > 2;
}

//Searches for games whenever a key is pressed in any text input
var searchGame = function(){

    //Must have 3 or more characters to initiate a search
    if (!shouldShow(this.value)) {
        subbox.style.visibility = "hidden";
        subbox.style.display = "none";
        return;
    }

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

    request.open("GET", "/api/search?q=" + this.value + "&type=games", true);
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

    //delete the entire parent div
    gamesList.removeChild(button.parentNode);
};

//Add a new game input when the button is clicked
document.querySelector(".add-another").onclick = function() {

    //create new div
    var div = document.createElement("div");

    //create new input
    var input = document.createElement("input");
    input.type = "text";
    input.className = "input-game";
    input.name = "games";
    input.onkeyup = searchGame;

    //create new remove image
    var remove = document.createElement("img");
    remove.src = "/images/remove.png";
    remove.className = "remove";
    remove.onclick = deleteGame;

    //create new checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    //create favorite text label
    var favorite = document.createTextNode("Favorite");

    //append the elements
    div.appendChild(input);
    div.appendChild(remove);
    div.appendChild(checkbox);
    div.appendChild(favorite);

    //append div to games list
    gamesList.appendChild(div);
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
