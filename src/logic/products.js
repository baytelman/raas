var format = require("string-template")
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var productsDao = require("../dao/products");

var fs = require('fs');

var transporter = null;
if (config.email.service) {

    transporter = nodemailer.createTransport(smtpTransport({
        service: config.email.service,
        auth: {
            user: config.email.username,
            pass: config.email.pass
        }
    }));
}

var emailWelcomeString = fs.readFileSync('resources/templates/new_product_email.txt', 'utf-8');
var introString = fs.readFileSync('resources/templates/intro.txt', 'utf-8');

module.exports = {

    createNewProductAndSendToken: function(email, callback) {
        productsDao.insertNewProduct(function(productId) {

            productsDao.updateProductDescription(productId, {
                email: email
            }, function() {
                productsDao.getAccessTokenForProduct(productId, function (accessToken) {

                    if (transporter) {
                        var params = {
                            message: 'product added: ' + productId,
                            product_id: productId,
                            access_token: accessToken
                        };

                        var subject = "Welcome to RAASta ✔";
                        if (config.env != 'prod') {
                            subject += " (" + config.env + ")";
                        }

                        var body = format(emailWelcomeString + introString, params);

                        transporter.sendMail({
                            from: config.email.username,
                            to: email,
                            subject: subject,
                            text: body
                        }, function (error, response) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Message sent to " + email);
                            }
                        });
                    }

                    callback(productId, email);
                });
            });
        });
    },
};