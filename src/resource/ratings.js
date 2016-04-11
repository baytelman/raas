"use strict";

var ratingsDao = require('../dao/ratings.js');
var validation = require('../utils/validation.js');

module.exports = {
    insert: function(req, res) {
        if (!validation.validateQueryParams(req, res, ['token', 'user', 'rating'])) {
            console.track('api-ratings-insert-fail');
        } else {
            console.track('api-ratings-insert');
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
                // TODO: Calculate averages
            });
        }
    },
    stats: function(req, res) {
        console.track('api-ratings-stats');
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
