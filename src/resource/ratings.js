"use strict";

var git = require('git-rev');
var ratingsDao = require('../dao/ratings.js');

module.exports = {
    version: function(req, res) {
        git.short(function (hash) {
            res.send({
                commit: hash
            });
        });
    },
    insert: function(req, res) {
        var token = req.query.token;
        var user = req.query.user;
        var rating = req.query.rating;
        var key1 = req.query.key1;
        var key2 = req.query.key2;
        var key3 = req.query.key3;

        ratingsDao.insertRating(token, user, rating, key1, key2, key3, function(id) {
            res.send({
                message: 'rating added: ' + id,
                id: id
            });
        });
    },
    stats: function(req, res) {
        var token = req.query.token;
        var user = req.query.user;
        var key1 = req.query.key1;
        var key2 = req.query.key2;
        var key3 = req.query.key3;

        ratingsDao.selectStats(token, user, key1, key2, key3, function(stats) {
            res.send({
                message: 'stats',
                stats: stats,
                params: {
                    user:user,
                    key1:key1,
                    key2:key2,
                    key3:key3
                }
            });
        });
    }
};
