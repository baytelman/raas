var config = {};

config.api = {};
config.api.port = 3000;

config.db = {};
config.db.url = "postgresql://postgres:ourlittlesecret@" + process.env.POSTGRES_PORT_5432_TCP_ADDR +
    ":5432/ratings_test?param=value";

console.info(process.env.POSTGRES_PORT_5432_TCP_ADDR + ":5432/ratings_test?param=value")

config.email = {}

module.exports = config;
