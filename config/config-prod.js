var config = {};

config.api = {};
config.api.port = 80;

config.db = {};
config.db.url = process.env.PROD_DB_URL;

module.exports = config;
