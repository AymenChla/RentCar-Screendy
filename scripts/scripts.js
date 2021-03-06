function animateWelcome() {

    $('Home.title_2').fadeIn(1000, 0);
    $('Home.msg_1').fadeIn(2000, 0);

    $('Home.myText').fadeIn(1000, 0);
    $('Home.msg3').fadeIn(2000, 0);

    $('Home.titlz1').fadeIn(1000, 0);
    $('Home.Text_1_51').fadeIn(2000, 0);

    $('Home.title_8').fadeIn(1000, 0);
    $('Home.Internal_link_p3').fadeIn(2000, 0);
    $('Home.Internal_link_286').fadeIn(3000, 0);

}

function welcomeBtn() {

    $('Home.Internal_link_p3').fadeIn(100, 0);
    js.js.navigateToPage('register');

}


function showReservations() {

    //clear list objet
    $('reservations_drawer.myList').clear();

    var idClient = js.getData('idClient');
    var url_getUserReservations = 'https://reservationvehicules-91687.firebaseio.com/reservations.json?orderBy="id_client"&equalTo=' + idClient;
    var userReservations = JSON.parse($.get(url_getUserReservations));

    //js.alert(JSON.stringify(userReservations));
    var url_getvehiculeInfo;
    var finalData = {};
    var vehicule_info;
    var noReservations = true;
    for (var i in userReservations) {
        var moment_reservation = userReservations[i].reservation_moment;
        var payer = userReservations[i].payer;
        //si delay depasser sans payer
        if (PayementDelay(moment_reservation) && !payer) {
            js.saveData("id_reservation", i);
            cancelReservation();
        } else {
            url_getvehiculeInfo = 'https://reservationvehicules-91687.firebaseio.com/vehicules/' + userReservations[i].id_vehicule + '/.json';
            vehicule_info = JSON.parse($.get(url_getvehiculeInfo));

            var agence = JSON.parse($.get("https://reservationvehicules-91687.firebaseio.com/agences/" + vehicule_info.id_agence + "/.json"));
            //js.alert(JSON.stringify(vehicule_info));
            finalData = {
                id_reservation: i,
                image: vehicule_info.image,
                code_acriss: vehicule_info.code_acriss,
                marque: vehicule_info.marque,
                model: vehicule_info.model,
                categorie: vehicule_info.categorie,
                adresse: agence.adresse,
                tel: agence.tel,
                latitude: agence.latitude,
                longitude: agence.longitude,
                pickup_date: userReservations[i].pickup_date,
                pickup_time: userReservations[i].pickup_time,
                return_date: userReservations[i].return_date,
                return_time: userReservations[i].return_time,
                code_reservation: userReservations[i].code_reservation,
                reservation_moment: userReservations[i].reservation_moment,
                payer: userReservations[i].payer

            };

            $('reservations_drawer.myList').addItem(JSON.stringify(finalData));
            noReservations = false;

        }

    }

    if (noReservations == true) {
        //msg no reservations to show
        // $('reservations_drawer.msg').val("text", "You don't have any reservation");
        js.toast("You don't have any reservation");
    }



    //js.hideLoader();

}

function generateCodeReservation() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function loadInfo() {
    var adresse = js.getData('adresse');
    var tel = js.getData('tel');
    var latitude = js.getData('latitude');
    var longitude = js.getData('longitude');
    var setPosition = {
        "object": "map_localisation_drawer.myMap",
        "value": [{
            "title": "Location",
            "subTitle": "",
            "latitude": latitude + "",
            "longitude": longitude + "",
            "positionIcon": "",
            "root": "",
            "parameters": ""
        }]
    };

    //add position
    js.execute("add()", JSON.stringify(setPosition));

    if ($('map_localisation_drawer.adresse') != null)
        $('map_localisation_drawer.adresse').val('text', adresse);
    if ($('map_localisation_drawer.tel') != null)
        $('map_localisation_drawer.tel').val('text', tel);

}

function backToReservations() {
    js.navigateToPage('reservations_drawer');
}

function animateShowMap(adresse, tel, latitude, longitude) {
    $('reservation_details_drawer.Container_272').move(500, 0, 'X');

    js.saveData('adresse', adresse);
    js.saveData('tel', tel);
    js.saveData('latitude', latitude);
    js.saveData('longitude', longitude);

    $.setTimeout('showMap()', 1000);

}

function showMap() {

    var adresse = js.getData('adresse');
    var tel = js.getData('tel');
    var latitude = js.getData('latitude');
    var longitude = js.getData('longitude');


    js.navigateToPage('map_localisation_drawer');
    js.saveData('adresse', adresse);
    js.saveData('tel', tel);
    js.saveData('latitude', latitude);
    js.saveData('longitude', longitude);
}


function mod(a, b) {
    return a < b ? a : (a - Math.floor(a / b) * b);
}

function PayementDelay(moment_reservation) {
    if ((Date.now() - (moment_reservation + 24 * 3600 * 1000)) > 0)
        return true;
    else return false;
}

function loadReservation_details(actual, id_reservation, payer) {

    js.saveData('payer', payer);
    js.saveData("actual", actual);
    js.saveData("id_reservation", id_reservation);
    if (payer == "false")
        remainingTime();


}


function remainingTime() {

    var payer = js.getData("payer");
    //si la reservation et confirmer
    if (payer != null && payer == "true") {
        if ($('reservation_details_drawer.hourglass') !== null)
            $('reservation_details_drawer.hourglass').val('srcImg', "checked-32.png");
        if ($('reservation_details_drawer.timer') !== null)
            $('reservation_details_drawer.timer').val('text', "Reserved");
        if ($('reservation_details_drawer.compteur_msg') !== null)
            $('reservation_details_drawer.compteur_msg').val('text', " ");
    } else {

        var actual = js.getData("actual");
        var passed = Date.now() - actual;

        var nbsr = 24 * 3600 - Math.floor(passed * 0.001);
        var nbh = Math.floor(nbsr / 3600);
        var nbm = Math.floor(mod(nbsr, 3600) / 60);
        var nbs = mod(mod(nbsr, 3600), 60);

        if (nbh <= 0 && nbm <= 0 && nbs <= 0) {
            cancelReservation();
            js.toast("reservation has been canceled");
            js.navigateToPage("reservations_drawer");
        }
        if (nbh < 10) nbh = '0' + nbh;
        if (nbm < 10) nbm = '0' + nbm;
        if (nbs < 10) nbs = '0' + nbs;
        var reste = nbh + ":" + nbm + ":" + nbs;

        if ($('reservation_details_drawer.hourglass') !== null)
            $('reservation_details_drawer.hourglass').val('srcImg', "hourglass-32.png");
        if ($('reservation_details_drawer.timer') !== null)
            $('reservation_details_drawer.timer').val('text', reste);
        if ($('reservation_details_drawer.compteur_msg') !== null)
            $('reservation_details_drawer.compteur_msg').val('text', "Before canceling");

    }

    $.setTimeout('remainingTime()', 1000);


}

function cancelAndBack() {
    $('reservation_details_drawer.Image_button_534').bounce(100, 0);
    cancelReservation();
    js.toast("reservation canceled");
    js.navigateToPage("reservations_drawer");
}

function cancelReservation() {
    js.toast('Canceling...');
    var id_reservation = js.getData("id_reservation");
    var requete = "https://reservationvehicules-91687.firebaseio.com/reservations/" + id_reservation + "/.json";
    var obj = JSON.stringify(JSON.parse($.get(requete)));
    var requeteDelete = '{"url":"' + requete + '","method":"DELETE","parameters":' + obj + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
    var data = $.post(requeteDelete);

}

function animateShowOffers() {

    $('reservation_date_drawer.Container_58').move(500, 0, 'X');
    js.toast('Loading...');
    $.setTimeout('validationResevartionDate()', 1000);
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


    //save data for reservation process
    js.saveData('pickup_date', tab_pickup_date[2] + "-" + tab_pickup_date[1] + "-" + tab_pickup_date[0]);
    js.saveData('pickup_time', tab_pickup_time[0] + ":" + tab_pickup_time[1]);
    js.saveData('return_date', tab_return_date[2] + "-" + tab_return_date[1] + "-" + tab_return_date[0]);
    js.saveData('return_time', tab_return_time[0] + ":" + tab_return_time[1]);


    //get current date in millisecond format
    var current_ms = Date.now();

    var valide = true;
    //js.alert('\n' + today + ' pick: ' + pickup_date);
    if (pickup_date == "") {
        //js.hideLoader();
        js.toast("please select pickup date");
        valide = false;
    } else if (return_date == "") {
        //js.hideLoader();
        js.toast("please select return date");
        valide = false;
    } else if (pickup_time == "") {
        // js.hideLoader();
        js.toast("please select pickup time");
        valide = false;
    } else if (return_time == "") {
        //js.hideLoader();
        js.toast("please select return time");
        valide = false;
    } else {
        if (pickup_ms < current_ms) {
            //js.hideLoader();
            js.toast('pickup date must be up or equal to current date');
            valide = false;
        }
        if (return_ms < pickup_ms) {
            //js.hideLoader();
            js.toast("return date must be up or equal to pickup date");
            valide = false;
        }
    }


    if (valide) {
        //js.hideLoader();
        //$.showLoader();
        showOffers(pickup_ms, return_ms);
    }


}

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function geoSorting(offers) {

    js.toast('Loading...');

    var myLat = $.call('api.location.getLatitude()', {});
    var myLon = $.call('api.location.getLongitude()', {});
    offers.data.sort(function(a, b) {
        return getDistance(myLat, myLon, a.latitude, a.longitude) - getDistance(myLat, myLon, b.latitude, b.longitude);
    });

    return offers;
}

function showOffers(pickup_date, return_date) {
    js.toast('loading...');

    //calcule nombre de jour de reservation
    var nbjour = (return_date - pickup_date) / 1000 / 3600 / 24;
    //for minimum cost
    if (nbjour < 1) nbjour = 1;

    //save data for reservation process
    js.saveData('nbJour', nbjour);

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
        if (vehicules[t] != null) {
            //recuperer les reservations d'un vehicule
            url_getReservationsByVehicule_id = 'https://reservationvehicules-91687.firebaseio.com/reservations.json?orderBy="id_vehicule"&equalTo=' + t;

            reservations = JSON.parse($.get(url_getReservationsByVehicule_id));

            libre = true;
            for (var i in reservations) {

                var reservation_pickup_date = Date.parse(reservations[i].pickup_date + "T" + reservations[i].pickup_time + ":00.000");
                var reservation_return_date = Date.parse(reservations[i].return_date + "T" + reservations[i].return_time + ":00.000");

                //voir si c deja reserver pour cette intervale
                if ((reservation_pickup_date < pickup_date && pickup_date < reservation_return_date) ||
                    (reservation_pickup_date < return_date && return_date < reservation_return_date)) {

                    var moment_reservation = reservations[i].reservation_moment;
                    var payer = reservations[i].payer;
                    //si delay depasser sans payer
                    if (PayementDelay(moment_reservation) && !payer) {
                        js.saveData("id_reservation", i);
                        cancelReservation();
                        break;
                    }

                    libre = false;
                    break;
                }


            }




            if (libre) {

                var requete_agence = "https://reservationvehicules-91687.firebaseio.com/agences/" + vehicules[t].id_agence + "/.json";
                var agence = JSON.parse($.get(requete_agence));

                var prix = (vehicules[t].prix - vehicules[t].prix * vehicules[t].solde / 100);

                finalData = {
                    id_vehicule: t,
                    marque: vehicules[t].marque,
                    model: vehicules[t].model,
                    prix: prix,
                    image: vehicules[t].image,
                    description: vehicules[t].description,
                    categorie: vehicules[t].categorie,
                    nbValises: vehicules[t].nbValises,
                    nbPassagers: vehicules[t].nbPassagers,
                    consommation: vehicules[t].consommation,
                    nbPortes: vehicules[t].nbPortes,
                    prixTotal: Math.round(prix * nbjour * 100) / 100,
                    code_acriss: vehicules[t].code_acriss,
                    ancien_prix: vehicules[t].prix,
                    latitude: agence.latitude,
                    longitude: agence.longitude,
                    adresse: agence.adresse
                };

                //$('offers_drawer.myList').addItem(JSON.stringify(finalData));
                offers.data.push(finalData);

            }
        }

        //$.alert(JSON.stringify(reservations));


    }
    //$('offers').reload('blank', '');
    //js.navigateToPage("offers_drawer");
    //js.saveData('offers', offers);

    //sort offers basing on geolocalisation
    offers = geoSorting(offers);
    js.navigateToPage('offers_drawer');


}

function animateReserveNow(id_vehicule, prix) {

    $('offer_details_drawer.Container_58').move(500, 0, 'X');
    js.toast('Booking...');
    js.saveData('id_vehicule', id_vehicule);
    js.saveData('prix', prix);
    $.setTimeout('reserveVehicule()', 1000);
}

function reserveVehicule() {
    var id_vehicule = js.getData('id_vehicule');
    var prix = js.getData('prix');

    // js.showLoader();

    var id_client = js.getData('idClient');
    var pickup_date = js.getData('pickup_date');
    var pickup_time = js.getData('pickup_time');
    var return_date = js.getData('return_date');
    var return_time = js.getData('return_time');
    var nbJours = js.getData('nbJour');

    var url = "https://reservationvehicules-91687.firebaseio.com/reservations/.json";
    var len = JSON.parse($.get(url)).length;

    var id = parseInt(len);
    var param = '{"' + id + '":{id_client :' + id_client + ',id_vehicule :' + id_vehicule + ',code_reservation :' + generateCodeReservation() + ',nbJours :' + nbJours + ',payer :' + false + ',pickup_date : "' + pickup_date + '",pickup_time :"' + pickup_time +
        '",prix :' + prix + ',return_date :"' + return_date + '",return_time :"' + return_time + '",reservation_moment :' + Date.now() + '}}';

    //js.alert(param);
    var urljson = '{"url":"' + url + '","method":"PATCH","parameters":' + param + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
    // Calling the function POST
    var data = $.post(urljson);

    //remove duplicated data
    var obj2 = JSON.parse($.get(url));
    for (var j in obj2) {
        //js.alert(JSON.stringify(j));
        for (var i in obj2[j]) {
            if (i == id) {
                $urlfav2 = "https://reservationvehicules-91687.firebaseio.com/reservations/" + j + "/.json";
                urljson2 = '{"url":"' + $urlfav2 + '","method":"DELETE","parameters":' + param + ',"headers":"contenttype=application/json","parametersFormat":"JSON",' + '"parametersMarkup":"Body"}';
                datafav = $.post(urljson2);
            }
        }
    }


    js.navigateToPage('reservations_drawer');

}

function backToDateChooser() {
    $('offers_drawer.Image_button_274').rotate(1000, 0, 0);
    js.navigateToPage('reservation_date_drawer');
    $('reservation_date_drawer').reload('blank', '');
}

function backToReservations() {
    js.navigateToPage('reservations_drawer');
    $('reservations_drawer').reload('blank', '');
}

function backToOffers() {
    js.navigateToPage('offers_drawer');
    $('offers_drawer').reload('blank', '');
}


function loadOffers() {

    //$.hideLoader();
    var car_info = {};
    //var offers = js.getData('offers');
    //js.alert(JSON.stringify(offers));
    $('offers_drawer.myList').clear();
    for (var i in offers.data) {
        car_info = {
            id_vehicule: offers.data[i].id_vehicule,
            marque: offers.data[i].marque,
            model: offers.data[i].model,
            image: offers.data[i].image,
            prix: offers.data[i].prix,
            prixTotal: offers.data[i].prixTotal,
            code_acriss: offers.data[i].code_acriss,
            nbValises: offers.data[i].nbValises,
            nbPassagers: offers.data[i].nbPassagers,
            consommation: offers.data[i].consommation,
            nbPortes: offers.data[i].nbPortes,
            categorie: offers.data[i].categorie,
            ancien_prix: offers.data[i].ancien_prix,
            latitude: offers.data[i].latitude,
            longitude: offers.data[i].longitude,
            adresse: offers.data[i].adresse
        };
        $('offers_drawer.myList').addItem(JSON.stringify(car_info));
    }


    //js.hideLoader();
    //$('offers_drawer').reload();
    //$('offers.myList').addItem(JSON.stringify(finalData));
    //$('offers_drawer').reload('blank', '');
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
    js.navigateToPage('signin', 'self', '');
}

function signUp() {

    $('register.Submit_239').fadeIn(100, 0);

    var firstName = $('register.firstName').val('value');
    var lastName = $('register.lastName').val('value');
    var email = $('register.email').val('value');
    var tel = $('register.tel').val('value');
    var pass = $('register.password').val('value');
    var passConfirm = $('register.passwordConfirm').val('value');


    var $url = 'https://reservationvehicules-91687.firebaseio.com/clients/.json?orderBy="email"&startAt="' + email + '"&endAt="' + email + '"';
    var data = $.get($url);
    if (firstName == "" || lastName == "" || pass == "" || email == "" || passConfirm == "" || tel == "") {
        $.toast("Please fill in all the fields");
    } else if (pass != passConfirm) {
        $.toast("Password and password confirmation don't match!");
    } else {
        var isEmail = js.isEmail(email);
        if (isEmail != "true") {
            $.toast("This is not a valid email address !");
        } else {
            var obj = JSON.parse(data);
            //js.alert(JSON.stringify(obj));

            //tester si le resultat est vide
            if (JSON.stringify(obj) != "{}") {
                $.toast("Email already exist, please change it!");
                return;
            }
        }

        var len = JSON.parse($.get("https://reservationvehicules-91687.firebaseio.com/clients/.json")).length;
        //$.alert(len);
        AddUser(len);

        js.saveData("idClient", len)
        //js.navigateToPage('gridlist_offres');
        js.navigateToPage('reservation_date_drawer');
        js.toast('WELCOME');

    }
}


function signIn() {
    $('signin.Submit_384').fadeIn(100, 0);

    email = $('signin.email').val('value');
    pass = $('signin.password').val('value');
    var url = 'https://reservationvehicules-91687.firebaseio.com/clients/.json?orderBy="email"&startAt="' + email + '"&endAt="' + email + '"';

    if (pass == "" || email == "") {
        $.toast("Please fill in all the fields");
    } else {
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
        //$.hideLoader();
        if (found == true) {
            js.saveData("idClient", index);
            js.navigateToPage('reservation_date_drawer');
        } else {
            $.toast("Email or Password incorrect !");
        }
    }
}

function onSignInFailure(err) {
    $.toast("Error: " + err);
}