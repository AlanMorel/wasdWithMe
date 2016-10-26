var screen = document.querySelector("html");
var box = document.querySelector(".results-box");
var search = document.querySelector(".search-box");
var select = document.querySelector('select[name="type"]');
var oneUps = document.querySelectorAll(".one-ups-label");

//returns true if box should be shown, false if not
function shouldShow(query){
    return query && query.length > 2;
}

search.onkeyup = function() {

    //Must have 3 or more characters to initiate a search
    if (!shouldShow(search.value)) {
        box.style.visibility = "hidden";
        return;
    }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {

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
};

screen.onclick = function(e) {
    if (e.target === search){
        //If the search bar was clicked
        box.style.visibility = shouldShow(search.value) ? "visible" : "hidden";
    } else if(e.target != box) {
        //Hide the search box if anything else was clicked on
        box.style.visibility = "hidden";
    }
};

for (var i = 0; i < oneUps.length; i++) {
    oneUps[i].onclick = function() {
        this.classList.toggle('one-upped');
    };
}