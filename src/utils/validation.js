"use strict";

module.exports = {
    validateQueryParams: function (req, res, queryParams, postParams) {
        var valid = true;
        if (queryParams) {
            queryParams.forEach(function (param) {
                if (!req.query[param]) {
                    var message = "query param not found (" + param + ")";

                    console.error(message);
                    res.status(412).send(message);
                    valid = false;
                }
            });
        }
        if (postParams) {
            postParams.forEach(function (param) {
                if (!req.body[param]) {
                    var message = "body param not found (" + param + ")";

                    console.error(message);
                    res.status(412).send(message);
                    valid = false;
                }
            });
        }
        return valid;
    }
};