function stop() {

var gender = "";

    if( $('[name="username"]').length <= 0 || $('[name="username"]').length >= 33 ||
     ($('[name="password"]').length <= 7 || $('[name="password"]').length >= 33) ||
      $('[name="email"]').length <=2 || $('[name="email"]').length >=64) {
        $("#feedback").html("Please fill in all required information!");
      //username 1-32
      //password 8-32
      //email a@a.a (3) - 64

        return false;
      } else {
        $("#feedback").html("");
      }



        var country = "";
        var state = "";
        var city = "";

        $("[name=gender] option").each(function() {
          if ($(this.is(":selected"))) {
            //set to option
            gender = this.is(":selected");
          }
        });


        // regular expression to match required date format
        re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

        if(form.startdate.value !== '') {
         if(regs === form.startdate.value.match(re)) {
           // day value between 1 and 31
           if(regs[1] < 1 || regs[1] > 31) {
             alert("Invalid value for day: " + regs[1]);
             form.startdate.focus();
             return false;
           }
           // month value between 1 and 12
           if(regs[2] < 1 || regs[2] > 12) {
             alert("Invalid value for month: " + regs[2]);
             form.startdate.focus();
             return false;
           }
           // year value between 1902 and 2016
           if(regs[3] < 1902 || regs[3] > (new Date()).getFullYear()) {
             alert("Invalid value for year: " + regs[3] + " - must be between 1902 and " + (new Date()).getFullYear());
             form.startdate.focus();
             return false;
           }
         } else {
           alert("Invalid date format: " + form.startdate.value);
           form.startdate.focus();
           return false;
         }
        }


        $("[name=country] option").each(function() {
         if ($(this.is(":selected"))) {
           //set to option
           country = this.is(":selected");
         }
        });

        $("[name=state] option").each(function() {
        if ($(this.is(":selected"))) {
          //set to option
          state = this.is(":selected");
        }
        });


        $("[name=city] option").each(function() {
         if ($(this.is(":selected"))) {
           //set to option
           city = this.is(":selected");
         }
        });

        if (gender==="" || country==="" || state==="" ||
         city==="" ) {
         $("#feedback").html("Please fill in all required information!");
         window.history.back();
         return false;
        }

        $("#feedback").html("");

        return true;
      }



//name 1-32
//username 1-32
//password 8-32
//email a@a.a (3) - 64
//   alert('f');
