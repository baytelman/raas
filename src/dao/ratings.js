"use strict";

var config = require('../config.js');
var pg = require('pg');

var ratingsDao = {};

module.exports = {
    getCurrentTime: function(timeCallback) {
        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query('SELECT NOW() as now', function(err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                };
                timeCallback(result.rows[0].now);
            });
        });
    },
    insertRating: function(token, user, rating, key1, key2, key3, insertCallback) {
        const RATING_INSERT = 'INSERT INTO ratings (token, userId, rating, key1, key2, key3) \
        VALUES ($1, $2, $3, $4, $5, $6) \
        RETURNING id';

        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query(RATING_INSERT, [token, user, rating, key1, key2, key3], function(err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                };
                insertCallback(result.rows[0].id);
            });
        });
    },
    selectStats: function(token, user, key1, key2, key3, statsCallback) {
        const RATING_STATS = 'SELECT \
            user, key1, key2, key3, avg(rating) as average \
            FROM \
            ratings \
            WHERE \
            token = $1 \
            GROUP BY \
            user, key1, key2, key3';

        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            if (!user) user = -1;
            if (!key1) key1 = -1;
            if (!key2) key2 = -1;
            if (!key3) key3 = -1;

            client.query(RATING_STATS, [token], function(err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                };
                statsCallback(result.rows[0]);
            });
        });
    },
};
