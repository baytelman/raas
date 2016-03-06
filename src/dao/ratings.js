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
    }
};
