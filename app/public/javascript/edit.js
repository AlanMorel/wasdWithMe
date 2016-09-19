var currentInput = null;

function addOnKeyUps(){
    var inputs = document.querySelectorAll(".input-game");
    for (var i = 0; i < inputs.length; ++i) {
        inputs[i].onkeyup = function(){
            currentInput = this;
            var request = new XMLHttpRequest();

            var subbox = document.querySelector("span.sub-results-box");
            this.parentNode.insertBefore(subbox, this.nextSibling);

            request.onreadystatechange = function() {
                if (request.readyState != 4 || request.status != 200 || request.responseText.length < 1){
                    //If something went wrong or no results returned, hide box
                    subbox.style.visibility = "hidden";
                    subbox.style.display = "none";
                    return;
                }

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
    }
}

var selectGame = function(){
    //Set the text input to the clicked game
    var name = this.querySelector(".name").innerHTML;
    currentInput.value = name;
    currentInput.readOnly = true;

    //Hide the box since game selection was made
    var subbox = document.querySelector("span.sub-results-box");
    subbox.style.visibility = "hidden";
    subbox.style.display = "none";
    return false;
};

addOnKeyUps();

//Add a new game input when the button is clicked
document.querySelector(".add-another").onclick = function() {
    var input = document.createElement("input");
    input.type = "text";
    input.className = "input-game";
    input.name = "games";
    document.querySelector(".games-list").appendChild(input);

    addOnKeyUps();
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
