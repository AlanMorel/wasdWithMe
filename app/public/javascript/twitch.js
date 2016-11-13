var twitchUsername = document.querySelector(".twitch-username");
var twitchProfile = document.querySelector(".twitch-profile");

function loadTwitch(){
    if (twitchUsername.value.length == 0){
        return;
    }

    twitchProfile.innerHTML = "Loading your Twitch account...";
    var request = new XMLHttpRequest();

    request.onload = function() {

        if (request.readyState != 4 || request.status != 200 || request.responseText.length < 1){
            steamProfile.innerHTML = "Something went wrong loading your Twitch account.";
            return;
        }

        twitchProfile.innerHTML = request.responseText;
    };

    request.open("GET", "/api/twitch?username=" + twitchUsername.value, true);
    request.send();
}

loadTwitch();
