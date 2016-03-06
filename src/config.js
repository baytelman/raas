var env = process.env.ENV;

if (!env) throw new Error("Missing ENV variable");

module.exports = require('../config/config-' + env + ".js");
