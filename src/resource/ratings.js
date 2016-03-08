"use strict";

var git = require('git-rev');
var ratingsDao = require('../dao/ratings.js');

var validateQueryParams = function(req, res, queryParams) {
    var valid = true;
    queryParams.forEach(function(param) {
        if (! req.query[param]) {
            var message = "query param not found (" + param + ")";
            var error = new Error(message);
            console.error(message);
            res.status(412).send(message);
            valid = false;
        }
    });
    return valid;
};

module.exports = {
    version: function(req, res) {
        console.mixpanel.track('api-version');
        git.short(function (hash) {
            res.send({
                commit: hash
            });
        });
    },
    insert: function(req, res) {

        if (!validateQueryParams(req, res, ['token', 'user', 'rating'])) {
            console.mixpanel.track('api-ratings-insert-fail');
        } else {
            console.mixpanel.track('api-ratings-insert');
            var token = req.query.token;
            var user = req.query.user;
            var rating = req.query.rating;
            var key1 = req.query.key1;
            var key2 = req.query.key2;
            var key3 = req.query.key3;

            ratingsDao.insertRating(token, user, rating, key1, key2, key3, function (id) {
                res.send({
                    message: 'rating added: ' + id,
                    id: id
                });
            });
        }
    },
    stats: function(req, res) {
        console.mixpanel.track('api-ratings-stats');
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
