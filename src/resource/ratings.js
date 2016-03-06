"use strict";

var ratingsDao = require('../dao/ratings.js');
var ratingsResource = {};

module.exports = {
    ping: function(req, res) {
        res.send('ping');
    },
    insert: function(req, res) {
        var token = req.query.token;
        var rating = req.query.rating;
        var key1 = req.query.key1;
        var key2 = req.query.key2;
        var key3 = req.query.key3;

        ratingsDao.insertRating(token, rating, key1, key2, key3, function(id) {
            res.send('rating added: ' + id);
        });
    }
};
