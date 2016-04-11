"use strict";

var git = require('git-rev');
var reviewsDao = require('../dao/reviews.js');
var validation = require('../utils/validation.js');

module.exports = {
    insert: function(req, res) {
        if (!validation.validateQueryParams(req, res, ['token', 'user'], ['title', 'body'])) {
            console.track('api-reviews-insert-fail');
        } else {
            console.track('api-reviews-insert');
            var token = req.query.token;
            var user = req.query.user;
            var key1 = req.query.key1;
            var key2 = req.query.key2;
            var key3 = req.query.key3;

            var body = req.body.body;
            var title = req.body.title;

            reviewsDao.insertReview(token, user, title, body, key1, key2, key3, function (id) {
                res.send({
                    message: 'review added: ' + id,
                    id: id
                });
            });
        }
    },
    latest: function(req, res) {
        console.track('api-reviews-all');
        var token = req.query.token;
        var user = req.query.user;
        var key1 = req.query.key1;
        var key2 = req.query.key2;
        var key3 = req.query.key3;

        reviewsDao.latestReviews(token, user, key1, key2, key3, function(reviews) {
            res.send({
                message: 'reviews',
                reviews: reviews,
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
