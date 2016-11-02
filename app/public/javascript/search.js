var form = document.querySelector(".refinement > form");

var query = document.querySelector(".search-box");
var type = document.querySelector(".search select");
var checkboxes = document.querySelectorAll("input[type=checkbox]");

function sendRefinedQuery(){
    addData(form, "query", query.value);
    addData(form, "type", type.value);
    addData(form, "availability", getAvailabilityValue());
}

function getAvailabilityValue(){
    var value = 0;
    for (var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].checked){
            value |= 1 << i;
        }
    }
    return value;
}

function addData(form, key, value){
    form.innerHTML = form.innerHTML + "<input type='hidden' name='" + key + "' value='" + value + "' />";
}
