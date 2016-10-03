// TODO rewrite to use AJAX
function stop(e) {

    var forward = true;
    var gen = $("[name=gender] option").filter(":selected").val();
    var country = $("[name=country] option").filter(":selected").text();
    var state = $("[name=state] option").filter(":selected").text();
    var city = $("[name=city] option").filter(":selected").text();

    if( $('[name="username"]').val() === "") {
      $("#username_feedback").html("Please fill in an username");
      forward=false;
    } else if ($('[name="username"]').val().length >= 33) {
      $("#username_feedback").html("Username exceeds maximum number of characters");
      forward=false;
    } else {
      $("#username_feedback").html("");
    }

    if($('[name="password"]').val().length <= 7) {
      $("#password_feedback").html("Password must be longer than 7 characters");
      forward=false;
    } else if ($('[name="password"]').val().length >= 33) {
      $("#password_feedback").html("Password must be shorter than 33 characters");
      forward=false;
    } else {
      $("#password_feedback").html("");
    }

    if ($('[name="email"]').val().length <=2 || $('[name="email"]').val().length >=64) {
      $("#email_feedback").html("Please enter a valid email");
      forward=false;
    } else {
      $("#email_feedback").html("");

    }


    var date = $('[name="date_of_birth"]').val().split('-');

    //Rearrange date order!
    var day = date[2];
    var month = date[1];
    var year = date[0];


    if (day > 31 || day <= 0 || month > 12 ||
      month <= 0 || year <=1900 || year >= 2016) {
      $("#date_feedback").html("Please enter a valid date");
      forward=false;
    } else {
      $("#date_feedback").html("");
    }


    if(forward===false) {
      $("#total_feedback").html("Please fill in all required information!");
      e.preventDefault();
    } else {
      $("#total_feedback").html("");
      return true;
    }

}
