function showSearchResults(str) {
    var results = document.querySelector(".results");

    if (!str || str.length < 3) {
        results.innerHTML = "";
        return;
    }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200 && request.responseText.length > 0) {
            console.log(request.responseText);
            var json = JSON.parse(request.responseText);
            var html = "";

            for (var i = 0; i < json.length; i++){
                html += "<div class='result'>" + json[i] + "</div>";
            }

            results.innerHTML = html;
        }
    };

    request.open("GET", "/api?q=" + str, true);
    request.send();
}