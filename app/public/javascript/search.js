var form = document.querySelector(".refinement > form");

var query = document.querySelector(".search-box");
var type = document.querySelector(".search select");
var checkboxes = document.querySelectorAll("input[type=checkbox]");
var numbers = document.querySelectorAll("input[type=number]");
var gender = document.querySelector(".option select");

function sendRefinedQuery(){
    addData(form, "query", query.value);
    addData(form, "type", type.value);
    addData(form, "availability", getAvailabilityValue());
    addData(form, "agemin", numbers[0].value);
    addData(form, "agemax", numbers[1].value);
    addData(form, "gender", gender.options[gender.selectedIndex].value);
    addData(form, "releasemin", numbers[2].value);
    addData(form, "releasemax", numbers[3].value);
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
