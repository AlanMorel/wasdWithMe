//Add a new game input when the button is clicked
document.querySelector(".add-another").onclick = function() {
    var input = '<input type="text" name="games" class="input-game">';
    document.querySelector(".games-list").innerHTML += input;
};

//Start the upload process when the pic is clicked
document.querySelector(".pic").onclick = function() {
    document.querySelector(".image-upload").click();
};

//Preview the image when selected
document.querySelector(".image-upload").onchange = function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        document.querySelector(".profile-pic").src = e.target.result;
    };

    reader.readAsDataURL(this.files[0]);
};
