/**
 * Created by fbaytelm on 3/12/16.
 */

var raasta = {
    initialized: false,
    token: null,
    user: null
}

raasta.init = function(token, user, overrideHost) {
    raasta.initialized = true;
    raasta.token = token;
    raasta.user = user;

    /* Override host is useful for custom implementations */
    if (overrideHost) {
        raasta.host = overrideHost;
    } else {
        raasta.host = "https://raasta.herokuapp.com"
    }
    console.info("[RAASTA] Initializing RAASTA (token: " + token + ")");
};

raasta.rate = function(params) {
    if (! raasta.initialized) {
        throw new Error("[RAASTA] Not initialized");
    }
    var user = raasta.user;
    var rating = params.rating;
    var key1 = params.key1;
    var key2 = params.key1;
    var key3 = params.key1;
    var success = params.success;

    var url = raasta.host + "/api/v1/ratings?token=" + raasta.token + "&rating=" + rating + "&user=" + user;
    if (key1) {
        url += "&key1=" + key1;
    }
    if (key2) {
        url += "&key2=" + key2;
    }
    if (key3) {
        url += "&key3=" + key3;
    }
    raasta._send("POST", url, success);
};

raasta._send = function(method, url, success) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            success(response);
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send();
};