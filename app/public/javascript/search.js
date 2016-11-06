var form = document.querySelector(".refinement > form");

var query = document.querySelector(".search-box");
var type = document.querySelector(".search select");
var checkboxes = document.querySelectorAll("input[type=checkbox]");
var numbers = document.querySelectorAll("input[type=number]");
var gender = document.querySelector("#gender");

var plays = document.querySelector(".plays");
var subbox = document.querySelector(".sub-results-box");

var country = document.querySelector("#country");
var state = document.querySelector("#state");
var city = document.querySelector("#city");

function sendQuery(){
    addData(form, "query", query.value);
    addData(form, "type", type.value);
    addData(form, "availability", getAvailabilityValue());
    addData(form, "agemin", numbers[0].value);
    addData(form, "agemax", numbers[1].value);
    addData(form, "gender", gender.options[gender.selectedIndex].value);
    addData(form, "releasemin", numbers[2].value);
    addData(form, "releasemax", numbers[3].value);
    addData(form, "plays", plays.value);
    addData(form, "country", country.options[country.selectedIndex].value);
    addData(form, "state", state.options[state.selectedIndex].value);
    addData(form, "city", city.options[city.selectedIndex].value);
}

function getAvailabilityValue(){
    var value = 0;
    for (var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].checked){
            value |= 1 << i;
        }
    }
    return value;
}

function addData(form, key, value){
    form.innerHTML = form.innerHTML + "<input type='hidden' name='" + key + "' value='" + value + "' />";
}

//returns true if box should be shown, false if not
function shouldSearch(search){
    return search && search.length > 2;
}

//Searches for games whenever a key is pressed in any text input
function searchGame(){

    //Must have 3 or more characters to initiate a search
    if (!shouldSearch(plays.value)) {
        subbox.style.visibility = "hidden";
        subbox.style.display = "none";
        return;
    }

    var request = new XMLHttpRequest();

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

    request.open("GET", "/api/search?q=" + plays.value + "&type=games", true);
    request.send();
}

//Selects a game whenever it is clicked
var selectGame = function(){
    //Set the text input to the clicked game's name
    var name = this.querySelector(".name").innerHTML;
    plays.value = name;

    //Hide the box since game selection was made
    subbox.style.visibility = "hidden";
    subbox.style.display = "none";

    return false;
};