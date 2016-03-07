"use strict";

var config = require('../config.js');
var pg = require('pg');


module.exports = {
    insertNewProduct: function(newProductCallback) {
        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query('INSERT INTO products (id) VALUES (DEFAULT) RETURNING id',
                function(err, result) {
                    done();
                    if (err) throw err;

                    var productId = result.rows[0].id;
                    console.log("Product inserted:" + productId);
                    newProductCallback(productId);
                });
        });
    },
    getAccessTokenForProduct: function(productId, accessTokenCallback) {
        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query('INSERT INTO tokens (product_id) VALUES ($1) RETURNING access_token',
                [productId],
                function(err, result) {
                    done();
                    if (err) throw err;

                    var token = result.rows[0].access_token;
                    console.log("Token inserted:" + token);
                    accessTokenCallback(token);
                });
        });
    },
    getProductDescription: function(productId, productCallback) {
        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query('SELECT * FROM ' +
                '   product_descriptions ' +
                'WHERE ' +
                '   product_id = $1 ' +
                'ORDER BY ' +
                '   timestamp DESC ' +
                'LIMIT 1',
                [productId],
                function(err, result) {
                    done();
                    if (err) throw err;

                    productCallback(result.rows[0]);
                });
        });
    },
    updateProductDescription: function(productId, newValues, insertCallback) {
        this.getProductDescription(productId, function(product) {

            if (!product) {
                product = {
                    name: 'New Product'
                };
            }
            for (var key in newValues) {
                product[key] = newValues[key];
            }
            product['timestamp'] = undefined;
            product['product_id'] = productId;

            const DESCRIPTION_INSERT = 'INSERT ' +
                'INTO product_descriptions ' +
                '   (product_id, name, email, key_1, key_2, key_3) ' +
                'VALUES ' +
                '   ($1, $2, $3, $4, $5, $6) ' +
                'RETURNING product_id';

            pg.connect(config.db.url, function(err, client, done) {
                if (err) throw err;

                client.query(DESCRIPTION_INSERT,
                    [product['product_id'],
                        product['name'],
                        product['email'],
                        product['key_1'],
                        product['key_2'],
                        product['key_3']],
                    function(err, result) {
                        done();
                        if (err) throw err;

                        insertCallback(result.rows[0].product_id);
                    });
            });
        });
    },
};
