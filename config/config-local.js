var config = {};

config.api = {};
config.api.port = 3000;

config.db = {};
config.db.url = "postgresql://postgres:@localhost:5432/ratings?param=value";

module.exports = config;
