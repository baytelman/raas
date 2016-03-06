"use strict";

var config = require('./config.js');

var express = require('express');
var ratingsResource = require('./src/resource/ratings.js');

const port = config.api.port;
var app = express();

app.get('/', ratingsResource.ping);

var base_url = '/api/v1/ratings';

//api/v1/ratings?token=ABC&rating=4&key1=123&key2=456
app.put(base_url, ratingsResource.insert);

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});
