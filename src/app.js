"use strict";

if (process.env.ENV == 'prod') require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');

var ratingsResource = require('./resource/ratings.js');
var reviewsResource = require('./resource/reviews.js');
var projectsResource = require('./resource/projects.js');

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
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/', function(req, res) {
        res.redirect("https://get-raasta.herokuapp.com");
    });
    app.use("/javascript", express.static('resources/static/javascript'));

    var base_url = '/api/v1/';
    app.get(base_url + 'version', projectsResource.version);
    app.put(base_url + 'projects', projectsResource.insert);
    app.post(base_url + 'projects', projectsResource.insert);

    app.get(base_url + 'ratings', ratingsResource.stats);
    app.put(base_url + 'ratings', ratingsResource.insert);
    app.post(base_url + 'ratings', ratingsResource.insert);

    app.get(base_url + 'reviews', reviewsResource.latest);
    app.put(base_url + 'reviews', reviewsResource.insert);
    app.post(base_url + 'reviews', reviewsResource.insert);
}

app.listen(port, function () {
    console.log('RAASTA listening on port ' + port + '!');
});

module.exports = app;
