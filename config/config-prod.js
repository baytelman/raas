var config = {};

config.api = {};
config.api.port = 80;

config.db = {};
config.db.url = process.env.PROD_DB_URL;

console.log(config.db.url);

module.exports = config;
