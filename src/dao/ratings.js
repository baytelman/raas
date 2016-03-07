"use strict";

var config = require('../config.js');
var pg = require('pg');

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
        const RATING_INSERT = "INSERT INTO ratings " +
            "   (product_id, user_id, rating, key1, key2, key3) " +
            "VALUES " +
            "   ((SELECT product_id FROM tokens WHERE access_token = $1 AND (expires IS NULL or expires > now()))," +
            "       $2, $3, $4, $5, $6) " +
            "RETURNING id";

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
        const RATING_STATS = "SELECT " +
            "   count(1)::int AS count, " +
            "   SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END)::int AS count5, " +
            "   SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END)::int AS count4, " +
            "   SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END)::int AS count3, " +
            "   SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END)::int AS count2, " +
            "   SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END)::int AS count1, " +
            "   ROUND(avg(rating)::numeric, 3)::real AS average, " +
            "   STDDEV(rating)::real AS stddev, " +
            "   VARIANCE(rating)::real AS variance " +
            "FROM " +
            "   ratings " +
            "WHERE " +
            "   product_id = (SELECT product_id FROM tokens WHERE access_token = $1 AND " +
            "                   (expires IS NULL or expires > now())) AND " +
            "   ($2::bigint IS NULL OR $2::bigint = user_id) AND " +
            "   ($3::bigint IS NULL OR $3::bigint = key1) AND " +
            "   ($4::bigint IS NULL OR $4::bigint = key2) AND " +
            "   ($5::bigint IS NULL OR $5::bigint = key3)";

        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query(RATING_STATS, [token, user, key1, key2, key3], function(err, result) {
                done();
                if (err) throw err;

                statsCallback(result.rows[0]);
            });
        });
    },
};
