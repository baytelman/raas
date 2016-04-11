"use strict";

var config = require('../config.js');
var pg = require('pg');

module.exports = {
    insertReview: function(token, user, title, body, key1, key2, key3, insertCallback) {
        const REVIEWS_INSERT = `
            INSERT INTO reviews
                (project_id, user_id, title, body, key1, key2, key3)
            VALUES
                ((SELECT project_id FROM tokens WHERE access_token = $1 AND (expires IS NULL or expires > now())),
                       $2, $3, $4, $5, $6, $7)
           RETURNING id`;

        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query(REVIEWS_INSERT, [token, user, title, body, key1, key2, key3], function(err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                };
                insertCallback(result.rows[0].id);
            });
        });
    },
    latestReviews: function(token, user, key1, key2, key3, reviewsCallback) {
        const REVIEWS_ALL = `
            SELECT
                title, body
            FROM
                reviews
            WHERE
                project_id = (SELECT project_id FROM tokens WHERE access_token = $1 AND
                    (expires IS NULL or expires > now())) AND
                ($2::varchar IS NULL OR $2::varchar = user_id) AND
                ($3::varchar IS NULL OR $3::varchar = key1) AND
                ($4::varchar IS NULL OR $4::varchar = key2) AND
                ($5::varchar IS NULL OR $5::varchar = key3)
            ORDER BY timestamp
            DESC LIMIT 30`;

        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query(REVIEWS_ALL, [token, user, key1, key2, key3], function(err, result) {
                done();
                if (err) throw err;

                reviewsCallback(result.rows);
            });
        });
    },
};
