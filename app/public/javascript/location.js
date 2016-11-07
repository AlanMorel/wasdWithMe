var country = document.querySelector("#country");
var state = document.querySelector("#state");
var city = document.querySelector("#city");

//if they all already have a value, populate the rest, otherwise, just populate the countries
if (country.options[country.selectedIndex] && state.options[state.selectedIndex] && city.options[city.selectedIndex]){
    var selectedCountry = country.options[country.selectedIndex].value;
    var selectedState = state.options[state.selectedIndex].value;
    var selectedCity = city.options[city.selectedIndex].value;
    update(selectedCountry, "country");
    update(selectedState, "state", selectedCountry);
    update(selectedCity, "city", selectedCountry, selectedState);
} else {
    update(null, "country");
}

country.addEventListener("change", function() {
    city.innerHTML = '';
    var selectedCountry = country.options[country.selectedIndex].value;
    update(null, "state", selectedCountry);
});

state.addEventListener("change", function() {
    var selectedCountry = country.options[country.selectedIndex].value;
    var selectedState = state.options[state.selectedIndex].value;
    update(null, "city", selectedCountry, selectedState);
});

//updates country, state and city dropdowns dynamically
function update(value, type, country, state){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/api/locations?type=" + type+ "&country=" + country + "&state=" + state, true);
    xhr.onload = function () {
        document.querySelector("#" + type).innerHTML = this.responseText;
        if (value) {
            document.querySelector("#" + type).value = value;
        }
    };
    xhr.send();
}
