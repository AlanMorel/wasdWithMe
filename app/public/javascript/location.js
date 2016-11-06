var api = "http://ganeshlore.com/projects/country_state_city_select_box/country_state_city_api.php";

var country = document.querySelector("#country");
var state = document.querySelector("#state");
var city = document.querySelector("#city");

//populate country right away
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
function update(area, country, state){

    if (!country){
        country = '';
    }

    if (!state){
        state = '';
    }

    var data = new FormData();
    data.append('area', area);
    data.append('country_id', country);
    data.append('state_id', state);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', api, true);
    xhr.onload = function () {
        var xml = new DOMParser().parseFromString(this.responseText, "text/xml");
        var objects = xml.getElementsByTagName('object');

        //populate results
        var results = '<option value="none" disabled selected>Select your ' + area + '</option>';
        for (var i = 0; i < objects.length ;i++) {
            results += '<option value="' + objects[i].childNodes[0].textContent + '">' + objects[i].childNodes[1].textContent + '</option>';
        }

        //set results and clear city value
        city.innerHTML = '';
        document.querySelector("#" + area).innerHTML = results;
    };
    xhr.send(data);
}
