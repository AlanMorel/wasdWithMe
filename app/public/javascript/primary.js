var screen = document.querySelector("html");
var box = document.querySelector(".results-box");
var search = document.querySelector(".search-box");
var select = document.querySelector('select[name="type"]');

search.onkeyup = function() {
    updateResults();
};

//returns true if box should be shown
function shouldShow(){
    return search.value && search.value.length > 2;
}

//updates the search results
function updateResults(){

    //Must have 3 or more characters to initiate a search
    if (!shouldShow()) {
        box.style.visibility = "hidden";
        return;
    }

    var request = new XMLHttpRequest();

    request.onload = function() {

        if (request.readyState != 4 || request.status != 200 || request.responseText.length < 1){
            //If something went wrong or no results returned, hide box
            box.style.visibility = "hidden";
            return;
        }

        //Display results to the user
        box.innerHTML = request.responseText;
        box.style.visibility = "visible";
    };

    var type = select.options[select.selectedIndex].value;

    request.open("GET", "/api/search?q=" + search.value + "&type=" + type, true);
    request.send();
}

screen.onclick = function(e) {
    if (e.target === search){
        //If the search bar was clicked
        box.style.visibility = shouldShow() ? "visible" : "hidden";
        if (box.innerHTML.length == 0){
            updateResults();
        }
    } else if(e.target != box) {
        //Hide the search box if anything else was clicked on
        box.style.visibility = "hidden";
    }
};

function sendOnUpRequest(element){
    var parent = element.parentElement;
    var id = parent.getAttribute("data-one-up-id");
    var type = parent.getAttribute("data-one-up-type");

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {

        if (request.readyState != 4 || request.status != 200 || request.responseText.length < 1){
            return;
        }

        flipOneUpState(element);
    };

    request.open("GET", "/api/oneup?type=" + type + "&id=" + id, true);
    request.send();
}

//flips the one upped state of the button
function flipOneUpState(element){
    element.classList.toggle('one-upped');

    var label = element.previousElementSibling;
    var value = parseInt(label.innerHTML);

    if (element.classList.contains("one-upped")){
        label.innerHTML = value + 1;
    } else {
        label.innerHTML = value - 1;
    }
}

var oneUps = document.querySelectorAll(".one-ups-button");

//add an onclick handler to every oneup button on the page
for (var i = 0; i < oneUps.length; i++) {
    oneUps[i].addEventListener('click', function(event){
        sendOnUpRequest(this);
    });
}
