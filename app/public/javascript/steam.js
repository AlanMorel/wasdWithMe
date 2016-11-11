var steamId = document.querySelector(".steam-id");
var steamProfile = document.querySelector(".steam-profile");

function importSteam(){
    if (steamId.value.length == 0){
        return;
    }
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {

        if (request.readyState != 4 || request.status != 200 || request.responseText.length < 1){
            //Something went wrong
            return;
        }

        //Display results to the user
        steamProfile.innerHTML = request.responseText;
    };

    request.open("GET", "/api/steam?id=" + steamId.value, true);
    request.send();
}
