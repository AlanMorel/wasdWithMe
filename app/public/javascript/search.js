var form = document.querySelector(".refinement > form");
var query = document.querySelector(".search-box");
var type = document.querySelector(".search select");

function sendRefinedQuery(){
    addData(form, "query", query.value);
    addData(form, "type", type.value);
}

function addData(form, key, value){
    form.innerHTML = form.innerHTML + "<input type='hidden' name='" + key + "' value='" + value + "' />";
}
