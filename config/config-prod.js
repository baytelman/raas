var config = {};

config.api = {};
config.api.port = process.env.PORT;

config.db = {};
config.db.url = process.env.PROD_DB_URL;

module.exports = config;
