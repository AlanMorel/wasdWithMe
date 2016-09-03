function showSearchResults(str) {
    var results = document.querySelector(".results");

    if (!str || str.length < 1) {
        //results.style.visibility = "hidden";
        return;
    }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200 && request.responseText.length > 0) {
            console.log(request.responseText);
            results.innerHTML = request.responseText;
            //results.style.visibility = "visible";
        } else {
            //results.style.visibility = "hidden";
        }
    };

    request.open("GET", "/api?q=" + str, true);
    request.send();
    //results.style.visibility = "visible";
}