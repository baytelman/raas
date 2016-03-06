var env = process.env.ENV;

if (!env) throw new Error("Missing ENV variable");

config = require('../config/config-' + env + ".js");

console.log("###############################");
console.log("config:");
console.log(config);
console.log("###############################");

module.exports = config;
