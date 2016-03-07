var config = {};

config.api = {};
config.api.port = process.env.PORT;

config.db = {};
config.db.url = process.env.PROD_DB_URL;

config.email = {}
config.email.service = "Gmail";
config.email.username = process.env.GMAIL_USERNAME;
config.email.pass = process.env.GMAIL_PASS;

module.exports = config;
