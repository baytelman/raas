var config = {};

config.api = {};
config.api.port = 80;

config.db = {};
config.db.url = "postgresql://postgres:ourlittlesecret@" + process.env.POSTGRES_PORT_5432_TCP_ADDR +
    ":5432/ratings_test?param=value";

console.log(process.env.POSTGRES_PORT_5432_TCP_ADDR +
":5432/ratings_test?param=value")

module.exports = config;
