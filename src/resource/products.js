"use strict";

var config = require('../config.js');
var productsLogic = require('../logic/products.js');

module.exports = {
    insert: function(req, res) {
        var email = req.query.email;
        productsLogic.createNewProductAndSendToken(email, function(productId, email) {
            res.send({
                message: 'product added: ' + productId,
                product_id: productId,
                email: email,
            });
        });
    },
};