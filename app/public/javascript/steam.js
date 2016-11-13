var steamId = document.querySelector(".steam-id");
var steamProfile = document.querySelector(".steam-profile");

function importSteam(){
    if (steamId.value.length == 0){
        return;
    }
    steamProfile.innerHTML = "Loading your Steam account...";
    var request = new XMLHttpRequest();

    request.onload = function() {

        if (request.readyState != 4 || request.status != 200 || request.responseText.length < 1){
            steamProfile.innerHTML = "Something went wrong loading your Steam account.";
            return;
        }

        //Display results to the user
        steamProfile.innerHTML = request.responseText;
    };

    request.open("GET", "/api/steam?id=" + steamId.value, true);
    request.send();
}
