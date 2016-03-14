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

raasta.register = function(params) {
    var email = params.email;
    var success = params.success;

    if (! email) {
        throw new Error("[RAASTA] 'email' param not provided");
    }

    var url = raasta.host + "/api/v1/projects?email=" + email;

    raasta._send("POST", url, success);
}

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
    return raasta._classNameForAverage(rating);
};

raasta.get = function(params) {
    if (! raasta.initialized) {
        throw new Error("[RAASTA] Not initialized");
    }
    var key1 = params.key1;
    var key2 = params.key2;
    var key3 = params.key3;
    var display = params.display;
    var style = params.style;
    var success = params.success;

    if (! display && ! style && ! success) {
        throw new Error("[RAASTA] Params must include at least display, style or success.");
    }

    var url = raasta.host + "/api/v1/ratings?token=" + raasta.token;
    if (key1) {
        url += "&key1=" + key1;
    }
    if (key2) {
        url += "&key2=" + key2;
    }
    if (key3) {
        url += "&key3=" + key3;
    }
    raasta._send("GET", url, function(response) {
        var average = response.stats.average;
        var count = response.stats.count;
        if (display) {
            var element = (typeof(display) == "string") ? document.getElementById(display) : display;
            if (average) {
                element.textContent = average.toFixed(1) + " (" + count + " ratings)";
            }
        }

        if (style) {
            var element = (typeof(style) == "string") ? document.getElementById(style) : style;
            var cName = element.className;
            if (cName) {
                cName = cName.replace(/raasta_._./,'');
            } else {
                cName = "";
            }
            cName += " " + raasta._classNameForAverage(average);
            element.className = cName;
        }

        if (success) {
            success(response.stats);
        }
    });
};

raasta._send = function(method, url, success) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if (success) {
                success(response);
            }
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send();
};

raasta._classNameForAverage = function(average) {
    var round = "" + (Math.round(average * 2) / 2.0).toFixed(1);
    return ("raasta_" + round).replace(".", "_").replace(",", "_");
}