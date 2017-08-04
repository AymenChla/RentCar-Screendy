<<<<<<< Updated upstream
=======
function defaultDateTime() {

    //0 $('reservation_date_form.Select_213').remove();
    $('reservation_date_drawer.pickup_date').val('value', '22/8/2017');
}

function validationResevartionDate() {
    var pickup_date = $('reservation_date_drawer.pickup_date').val('value');
    var pickup_time = $('reservation_date_drawer.pickup_time').val('value');
    var return_date = $('reservation_date_drawer.return_date').val('value');
    var return_time = $('reservation_date_drawer.return_time').val('value');

    //convert to format yyyy-mm-dd then to millisecond
    var tab_pickup_date = pickup_date.split("/");
    if (tab_pickup_date[0] < 10) {
        tab_pickup_date[0] = '0' + tab_pickup_date[0];
    }
    if (tab_pickup_date[1] < 10) {
        tab_pickup_date[1] = '0' + tab_pickup_date[1];
    }
    pickup_date = Date.parse(tab_pickup_date[2] + "-" + tab_pickup_date[1] + "-" + tab_pickup_date[0]);
    var tab_return_date = return_date.split("/");
    if (tab_return_date[0] < 10) {
        tab_return_date[0] = '0' + tab_return_date[0];
    }
    if (tab_return_date[1] < 10) {
        tab_return_date[1] = '0' + tab_return_date[1];
    }
    return_date = Date.parse(tab_return_date[2] + "-" + tab_return_date[1] + "-" + tab_return_date[0]);

    //get current date in millisecond format
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + "-" + mm + "-" + dd;
    today = Date.parse(today);

    var valide = true;

    //js.alert('\n' + today + ' pick: ' + pickup_date);
    if (isNaN(pickup_date)) {
        js.alert("please select pickup date");
        valide = false;
    } else if (isNaN(return_date)) {
        js.alert("please select return date");
        valide = false;
    } else {
        if (pickup_date < today) {
            js.alert('pickup date must be up or equal to current date');
            valide = false;
        }
        if (return_date < pickup_date) {
            js.alert("return date must be up or equal to pickup date");
            valide = false;
        }
    }


    if (valide)
        showOffers(pickup_date, return_date);

}

function showOffers(pickup_date, return_date) {



    var url_getAllVehicules = "https://reservationvehicules-91687.firebaseio.com/vehicules.json";

    var vehicules = JSON.parse($.get(url_getAllVehicules));

    //js.alert(JSON.stringify(obj));

    var url_getReservationsByVehicule_id;
    var reservations;
    var libre;

    //boucle pour chaque vehicule
    for (var id_vehicule in vehicules) {

        //recuperer les reservations d'un vehicule
        url_getReservationsByVehicule_id = 'https://reservationvehicules-91687.firebaseio.com/reservations.json?orderBy=%22id_vehicule%22&equalTo=' + id_vehicule;

        reservations = JSON.parse($.get(url_getReservationsByVehicule_id));

        libre = true;
        for (var i in reservations) {

            var reservation_pickup_date = Date.parse(reservations[i].pickup_date);
            var reservation_return_date = Date.parse(reservations[i].return_date);


            if ((reservation_pickup_date < pickup_date && pickup_date < reservation_return_date) ||
                (reservation_pickup_date < return_date && return_date < reservation_return_date)) {
                libre = false;

                //js.alert('id_vehi:' + id_vehicule + ' id_res: ' + i + ' reservation_pickup: ' + reservation_pickup_date + ' reservation_return: ' + reservation_return_date + ' ,pickup: ' + pickup_date + ' return: ' + return_date);
                break;
            }
        }

        if (libre) {
            js.alert(' libre');
        } else js.alert('non libre');

        //$.alert(JSON.stringify(reservations));
    }
}



>>>>>>> Stashed changes
function showMenu() {
    js.navigateToPage('menu', 'slideUp', ' ');
}

<<<<<<< Updated upstream
=======
function tessst() {
    js.navigateToPage('reservation_date_form');
}

function getCurrentDate() {
    var date = new Date();
    js.alert(date);
}

>>>>>>> Stashed changes
function listItem() {
    var url = "https://reservationvehicules-91687.firebaseio.com/vehicules.json";
    var obj = JSON.parse($.get(url));

    //$.alert(JSON.stringify(obj, null, 2));
    var finalData = {};

    $('principalpage.myList').clear();

    for (var t = 0; t < obj.length; t++) {
        finalData = {
            marque: obj[t].marque,
            model: obj[t].model,
            prix: obj[t].prix,
            image: obj[t].image,
            description: obj[t].description,
            categorie: obj[t].categorie,
            nbValises: obj[t].nbValises,
            nbPassagers: obj[t].nbPassagers,
            consommation: obj[t].consommation,
            nbPortes: obj[t].nbPortes
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
    var id = parseInt(len);
    var id = len;
    var param = '{"' + id + '":{firstName :' + firstName + ',lastName :' + lastName + ',tel :' + tel + ',email :' + email + ',password:' + pass + '}}';

    // The url of the database created on Firebase in a json format
    var $url = 'https://reservationvehicules-91687.firebaseio.com/clients/.json';
    // Setting the url that will be sent to the function POST and defining its method as PATCH to be able to use it in the platform
    var urljson = '{"url":"' + $url + '","method":"PATCH","parameters":' + param + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
    // Calling the function POST
    var data = $.post(urljson);
    //$.alert("Welcome !");

    //delete duplicated data
    var obj2 = JSON.parse($.get($url));
    for (var j in obj2) {
        js.alert(JSON.stringify(j));
        for (var i in obj2[j]) {
            if (i == id) {
                $urlfav2 = "https://reservationvehicules-91687.firebaseio.com/clients/" + j + "/.json";
                urljson2 = '{"url":"' + $urlfav2 + '","method":"DELETE","parameters":' + param + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
                datafav = $.post(urljson2);
            }
        }
    }

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
                var len = JSON.parse($.get("https://reservationvehicules-91687.firebaseio.com/clients/.json")).length;
                //$.alert(len);
                AddUser(len);
                js.saveData("client", email);
                js.navigateToPage('gridlist_offres');
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