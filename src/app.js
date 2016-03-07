"use strict";

if (process.env.ENV == 'prod') {
    require('newrelic');
}

var config = require('./config.js');

var express = require('express');
var ratingsResource = require('./resource/ratings.js');
var productsResource = require('./resource/products.js');

const port = config.api.port;
var app = express();

app.get('/', ratingsResource.ping);

var base_url = '/api/v1/';

app.put(base_url + "products", productsResource.insert);

app.get(base_url + "ratings", ratingsResource.stats);
app.put(base_url + "ratings", ratingsResource.insert);

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});

module.exports = app;
