"use strict";

if (process.env.ENV == 'prod') require('newrelic');
var express = require('express');

var ratingsResource = require('./resource/ratings.js');
var productsResource = require('./resource/products.js');

/* Configure the app */
var config = require('./config.js');
const port = config.api.port;

/* Start the right service */
var app = express();

if (process.env.APP == 'web') {
    app.use("/", express.static('resources/static'));
} else {

    var base_url = '/api/v1/';
    app.get(base_url + 'version', ratingsResource.version);

    app.put(base_url + "products", productsResource.insert);

    app.get(base_url + "ratings", ratingsResource.stats);
    app.put(base_url + "ratings", ratingsResource.insert);
}

app.listen(port, function () {
    console.log('RAASTA listening on port ' + port + '!');
});

module.exports = app;
