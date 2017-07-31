function listItem() {
    var url = "https://reservationvehicules-91687.firebaseio.com/vehicules.json";
    var obj = JSON.parse($.get(url));

    //$.alert(JSON.stringify(obj, null, 2));
    var finalData = {};

    //$('principalpage.myList').clear();

    for (var t = 0; t < obj.length; t++) {
        finalData = {
            marque: obj[t].marque,
            model: obj[t].model,
            prix: obj[t].prix
        };

        $('principalpage.myList').addItem(JSON.stringify(finalData));
    }

}


function AddUser(len) {
    // Getting the data from our objects

    var firstName = $('signup.firstName').val('value');
    var lastName = $('signup.lastName').val('value');
    var email = $('signup.email').val('value');
    var tel = $('signup.tel').val('value');
    var pass = $('signup.password').val('value');

    // Setting the parameters that will be passed to the method POST
    //var id = parseInt(len);
    //var id = len;
    var param = '{firstName :' + firstName + ',lastName :' + lastName + ',tel :' + tel + ',email :' + email + ',password:' + pass + '}';

    // The url of the database created on Firebase in a json format
    var $url = 'https://reservationvehicules-91687.firebaseio.com/clients/.json';
    // Setting the url that will be sent to the function POST and defining its method as PATCH to be able to use it in the platform
    var urljson = '{"url":"' + $url + '","method":"PATCH","parameters":' + param + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
    // Calling the function POST
    var data = $.post(urljson);
    //$.alert("Welcome !");

    //delete duplicated data
    /*var obj2 = JSON.parse($.get($url));
    for (var j in obj2) {
        for (var i in obj2[j]) {
            if (i == id) {
                $urlfav2 = "https://reservationvehicules-91687.firebaseio.com/clients" + j + "/.json";
                urljson2 = '{"url":"' + $urlfav2 + '","method":"DELETE","parameters":' + param + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
                datafav = $.post(urljson2);
            }
        }
    }*/

}

function signUp() {

    var firstName = $('signup.firstName').val('value');
    var lastName = $('signup.lastName').val('value');
    var email = $('signup.email').val('value');
    var tel = $('signup.tel').val('value');
    var pass = $('signup.password').val('value');
    var passConfirm = $('signup.passwordConfirm').val('value');


    var $url = "https://reservationvehicules-91687.firebaseio.com/clients/.json";
    var exist = false;
    var data = $.get($url);
    if (firstName == "" || lastName == "" || pass == "" || email == "" || passConfirm == "" || tel == "") {
        $.alert("Please fill in all the fields");
    } else if (pass != passConfirm) {
        $.alert("Password and password confirmation don't match!");
    } else {
        var isEmail = js.isEmail(email);
        if (isEmail != "true") {
            $.alert("This is not a valid email address !");
        } else {
            var obj = JSON.parse(data);
            for (var i in obj) {
                if (obj[i].email == email) {
                    exist = true;
                    $.alert("This user already exist");
                    return;
                }
            }
            if (exist == false) {
                //var len = JSON.parse($.get("https://reservationvehicules-91687.firebaseio.com/clients/.json")).length;
                //$.alert(len);
                //AddUser(len);
                AddUser();
                js.saveData("client", email);
                js.navigateToPage('mainpage');
            } else
                $.alert("Email already exist, please change it!");

        }
    }
}

function signIn() {

    email = $('Home.email').val('value');
    pass = $('Home.password').val('value');
    var url = "https://reservationvehicules-91687.firebaseio.com/clients/.json";

    if (pass == "" || email == "") {
        $.alert("Please fill in all the fields");
    } else {
        $.showLoader();
        $.get(url, onSignInSuccess, onSignInFailure);
    }
}


function onSignInSuccess(data) {

    if (data != null) {
        var obj = JSON.parse(data);

        var found = false;
        for (index in obj) {
            if (obj[index].email == email && obj[index].password == pass) {
                found = true;
                break;
            }
        }

        $.hideLoader();
        if (found == true) {
            js.saveData("client", email);
            js.navigateToPage('mainpage');
        } else {
            $.alert("Email or Password incorrect !");
        }
    }
}

function onSignInFailure(err) {
    $.hideLoader();
    $.alert("Error: " + err);
}