function defaultDateTime() {

    //0 $('reservation_date_form.Select_213').remove();
    $('reservation_date_drawer.pickup_date').val('value', '22/8/2017');
}

function validationResevartionDate() {

    //js.showLoader();

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
    var tab_return_date = return_date.split("/");
    if (tab_return_date[0] < 10) {
        tab_return_date[0] = '0' + tab_return_date[0];
    }
    if (tab_return_date[1] < 10) {
        tab_return_date[1] = '0' + tab_return_date[1];
    }

    //formating time
    var tab_pickup_time = pickup_time.split(":");
    if (tab_pickup_time[0] < 10) {
        tab_pickup_time[0] = '0' + tab_pickup_time[0];
    }
    if (tab_pickup_time[1] < 10) {
        tab_pickup_time[1] = '0' + tab_pickup_time[1];
    }
    var pickup_time_format = "T" + tab_pickup_time[0] + ":" + tab_pickup_time[1] + ":00.000";
    //js.alert(pickup_time);
    var tab_return_time = return_time.split(":");
    if (tab_return_time[0] < 10) {
        tab_return_time[0] = '0' + tab_return_time[0];
    }
    if (tab_return_time[1] < 10) {
        tab_return_time[1] = '0' + tab_return_time[1];
    }
    var return_time_format = "T" + tab_return_time[0] + ":" + tab_return_time[1] + ":00.000";
    //js.alert(return_time);
    //converting to millisecond
    var pickup_ms = Date.parse(tab_pickup_date[2] + "-" + tab_pickup_date[1] + "-" + tab_pickup_date[0] + pickup_time_format);
    var return_ms = Date.parse(tab_return_date[2] + "-" + tab_return_date[1] + "-" + tab_return_date[0] + return_time_format);



    //get current date in millisecond format
    var current_ms = Date.now();

    var valide = true;
    //js.alert('\n' + today + ' pick: ' + pickup_date);
    if (pickup_date == "") {
        //js.hideLoader();
        js.alert("please select pickup date");
        valide = false;
    } else if (return_date == "") {
        //js.hideLoader();
        js.alert("please select return date");
        valide = false;
    } else if (pickup_time == "") {
        // js.hideLoader();
        js.alert("please select pickup time");
        valide = false;
    } else if (return_time == "") {
        //js.hideLoader();
        js.alert("please select return time");
        valide = false;
    } else {
        if (pickup_ms < current_ms) {
            //js.hideLoader();
            js.alert('pickup date must be up or equal to current date');
            valide = false;
        }
        if (return_ms < pickup_ms) {
            //js.hideLoader();
            js.alert("return date must be up or equal to pickup date");
            valide = false;
        }
    }


    if (valide) {
        //js.hideLoader();
        showOffers(pickup_ms, return_ms);
    }


}

function getImageuRl() {
    var url = $('offers_drawer.Image_73').val('srcImage');
    js.alert(url);
}

function showOffers(pickup_date, return_date) {

    //calcule nombre de jour de reservation
    var nbjour = (return_date - pickup_date) / 1000 / 3600 / 24;
    //for minimum cost
    if (nbjour < 1) nbjour = 1;

    //js.showLoader();
    //js.navigateToPage('offers_drawer');
    offers = {
        data: []
    };

    var url_getAllVehicules = "https://reservationvehicules-91687.firebaseio.com/vehicules.json";

    var vehicules = JSON.parse($.get(url_getAllVehicules));

    //js.alert(JSON.stringify(obj));

    var url_getReservationsByVehicule_id;
    var reservations;
    var libre;
    var finalData = {};
    //boucle pour chaque vehicule
    for (var t in vehicules) {

        //recuperer les reservations d'un vehicule
        url_getReservationsByVehicule_id = 'https://reservationvehicules-91687.firebaseio.com/reservations.json?orderBy="id_vehicule"&equalTo=' + t;

        reservations = JSON.parse($.get(url_getReservationsByVehicule_id));

        libre = true;
        for (var i in reservations) {

            var reservation_pickup_date = Date.parse(reservations[i].pickup_date + "T" + reservations[i].pickup_time + ":00.000");
            var reservation_return_date = Date.parse(reservations[i].return_date + "T" + reservations[i].return_time + ":00.000");


            if ((reservation_pickup_date < pickup_date && pickup_date < reservation_return_date) ||
                (reservation_pickup_date < return_date && return_date < reservation_return_date)) {
                libre = false;

                //js.alert('id_vehi:' + id_vehicule + ' id_res: ' + i + ' reservation_pickup: ' + reservation_pickup_date + ' reservation_return: ' + reservation_return_date + ' ,pickup: ' + pickup_date + ' return: ' + return_date);
                break;
            }
        }

        if (libre) {


            finalData = {
                marque: vehicules[t].marque,
                model: vehicules[t].model,
                prix: vehicules[t].prix,
                image: vehicules[t].image,
                description: vehicules[t].description,
                categorie: vehicules[t].categorie,
                nbValises: vehicules[t].nbValises,
                nbPassagers: vehicules[t].nbPassagers,
                consommation: vehicules[t].consommation,
                nbPortes: vehicules[t].nbPortes,
                prixTotal: Math.round(vehicules[t].prix * nbjour * 100) / 100,
                code_acriss: vehicules[t].code_acriss
            };

            //$('offers_drawer.myList').addItem(JSON.stringify(finalData));
            offers.data.push(finalData);
        }

        //$.alert(JSON.stringify(reservations));


    }
    //$('offers').reload('blank', '');
    //js.navigateToPage("offers_drawer");
    //js.saveData('offers', offers);

    js.navigateToPage('offers_drawer');


}

function loadOffers() {

    var car_info = {};
    //var offers = js.getData('offers');
    //js.alert(JSON.stringify(offers));
    $('offers_drawer.myList').clear();
    for (var i in offers.data) {
        car_info = {
            marque: offers.data[i].marque,
            model: offers.data[i].model,
            image: offers.data[i].image,
            prix: offers.data[i].prix,
            prixTotal: offers.data[i].prixTotal,
            code_acriss: offers.data[i].code_acriss
        };
        $('offers_drawer.myList').addItem(JSON.stringify(car_info));
    }


    //js.hideLoader();
    //$('offers_drawer').reload();
    //$('offers.myList').addItem(JSON.stringify(finalData));
    //$('offers_drawer').reload('blank', '');
}


function showMenu() {
    js.navigateToPage('menu', 'slideUp', ' ');
}

function tessst() {
    js.navigateToPage('reservation_date_form');
}

function getCurrentDate() {
    var date = new Date();
    js.alert(date);
}

function listItem() {
    var url = "https://reservationvehicules-91687.firebaseio.com/vehicules/.json";
    var obj = JSON.parse($.get(url));

    //$.alert(JSON.stringify(obj, null, 2));
    var finalData = {};

    //$('principalpage.myList').clear();

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
            nbPortes: obj[t].nbPortes,
        };

        $('principalpage.myList').addItem(JSON.stringify(finalData));
    }

}


function AddUser(len) {
    // Getting the data from our objects

    var firstName = $('register.firstName').val('value');
    var lastName = $('register.lastName').val('value');
    var email = $('register.email').val('value');
    var tel = $('register.tel').val('value');
    var pass = $('register.password').val('value');

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
        //js.alert(JSON.stringify(j));
        for (var i in obj2[j]) {
            if (i == id) {
                $urlfav2 = "https://reservationvehicules-91687.firebaseio.com/clients/" + j + "/.json";
                urljson2 = '{"url":"' + $urlfav2 + '","method":"DELETE","parameters":' + param + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
                datafav = $.post(urljson2);
            }
        }
    }

}

function signOut() {
    js.navigateToPage('Home', 'self', '');
}

function signUp() {

    var firstName = $('register.firstName').val('value');
    var lastName = $('register.lastName').val('value');
    var email = $('register.email').val('value');
    var tel = $('register.tel').val('value');
    var pass = $('register.password').val('value');
    var passConfirm = $('register.passwordConfirm').val('value');


    var $url = 'https://reservationvehicules-91687.firebaseio.com/clients/.json?orderBy="email"&startAt="' + email + '"&endAt="' + email + '"';
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
            //js.alert(JSON.stringify(obj));

            //tester si le resultat est vide
            if (JSON.stringify(obj) != "{}") {
                $.alert("Email already exist, please change it!");
                return;
            }
        }

        var len = JSON.parse($.get("https://reservationvehicules-91687.firebaseio.com/clients/.json")).length;
        //$.alert(len);
        AddUser(len);

        js.saveData("idClient", len)
        //js.navigateToPage('gridlist_offres');
        js.navigateToPage('reservation_date_drawer');


    }
}

function forTest() {
    js.navigateToPage('reservation_date_drawer');
}

function signIn() {

    email = $('Home.email').val('value');
    pass = $('Home.password').val('value');
    var url = 'https://reservationvehicules-91687.firebaseio.com/clients/.json?orderBy="email"&startAt="' + email + '"&endAt="' + email + '"';

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
        //js.alert(JSON.stringify(obj));
        var found = false;
        for (index in obj) {
            if (obj[index].email == email && obj[index].password == pass) {
                found = true;
                break;
            }
        }
        //$.alert(index);
        $.hideLoader();
        if (found == true) {
            js.saveData("idClient", index);
            js.navigateToPage('reservation_date_drawer');
        } else {
            $.alert("Email or Password incorrect !");
        }
    }
}

function onSignInFailure(err) {
    $.hideLoader();
    $.alert("Error: " + err);
}