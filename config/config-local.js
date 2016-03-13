var config = {};

config.api = {};
config.api.port = 3000 + ((process.env.APP == 'web')? 1: 0);

config.db = {};
config.db.url = "postgresql://postgres:@localhost:5432/ratings?param=value";

config.email = {}
config.email.service = "Gmail";
config.email.username = process.env.GMAIL_USERNAME;
config.email.pass = process.env.GMAIL_PASS;

module.exports = config;
