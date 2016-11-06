var country = document.querySelector("#country");
var state = document.querySelector("#state");
var city = document.querySelector("#city");

//populate countries right away
update("country");

country.addEventListener("change", function() {
    var selectedCountry = country.options[country.selectedIndex].value;
    update("state", selectedCountry);
});

state.addEventListener("change", function() {
    var selectedCountry = country.options[country.selectedIndex].value;
    var selectedState = state.options[state.selectedIndex].value;
    update("city", selectedCountry, selectedState);
});

//updates country, state and city dropdowns dynamically
function update(type, country, state){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/api/locations?type=" + type+ "&country=" + country + "&state=" + state, true);
    xhr.onload = function () {
        city.innerHTML = '';
        document.querySelector("#" + type).innerHTML = this.responseText;
    };
    xhr.send();
}
