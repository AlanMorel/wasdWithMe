var screen = document.querySelector("html");
var box = document.querySelector(".results-box");
var search = document.querySelector(".search-box");

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
        if (request.readyState != 4 || request.status != 200 || request.responseText.length < 3){
            //If something went wrong or no results returned, hide box
            box.style.visibility = "hidden";
            return;
        }

        var data = JSON.parse(request.responseText);
        var html = "";

        //Build out the results html
        data.forEach(function(result){
            html += "<a href='/" + result.type + "/" + result.name + "'>";
            html += "<div class='result'><img src='" + result.image + "'/>";
            html += "<div class='info'><div class='name'>" + result.name + "</div>";
            html += "<div class='description'>" + result.description + "</div>";
            html += "</div></div></a>";
        });

        //Display results to the user
        box.innerHTML = html;
        box.style.visibility = "visible";
    };

    request.open("GET", "/api/search?q=" + search.value, true);
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
