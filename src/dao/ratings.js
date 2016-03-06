"use strict";

var config = require('../../config.js');
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
    insertRating: function(token, rating, key1, key2, key3, insertCallback) {
        const RATING_INSERT = 'INSERT INTO Ratings (token, rating, key1, key2, key3) VALUES ($1, $2, $3, $4, $5) RETURNING id';

        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query(RATING_INSERT, [token, rating, key1, key2, key3], function(err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                };
                insertCallback(result.rows[0].id);
            });
        });
    }
};
