function addAnother() {
    var input = '<input type="text" name="games" class="input-game">';
    document.querySelector(".games-list").innerHTML += input;
}

document.querySelector(".pic").onclick = function() {
    var upload = document.querySelector(".image-upload");
    upload.click();
};

document.querySelector(".image-upload").onchange = function () {
    var reader = new FileReader();

    reader.onload = function (e) {
        document.querySelector(".profile-pic").src = e.target.result;
    };

    reader.readAsDataURL(this.files[0]);
};