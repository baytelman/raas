"use strict";

if (process.env.ENV == 'prod') require('newrelic');
var express = require('express');

var ratingsResource = require('./resource/ratings.js');
var productsResource = require('./resource/products.js');

/* Configure the app */
var config = require('./config.js');
const port = config.api.port;
var Mixpanel = require('mixpanel');

if (process.env.ENV != 'test' && process.env.ENV != 'travis') {
    console.mixpanel = Mixpanel.init('b29b41ff48abeec3b8a8c8cf8d3241b0');
    console.track = console.mixpanel.track;
} else {
    console.track = function() {};
}

/* Start the right service */
var app = express();

if (process.env.APP == 'web') {
    app.use("/", express.static('resources/static'));
} else {
    app.get('/', function(req, res) {
        res.redirect("https://get-raasta.herokuapp.com");
    });

    var base_url = '/api/v1/';
    app.get(base_url + 'version', ratingsResource.version);
    app.put(base_url + 'products', productsResource.insert);

    app.get(base_url + 'ratings', ratingsResource.stats);
    app.put(base_url + 'ratings', ratingsResource.insert);
}

app.listen(port, function () {
    console.log('RAASTA listening on port ' + port + '!');
});

module.exports = app;
