var config = {};

config.api = {};
config.api.port = 3000;

config.db = {};
config.db.url = "postgresql://postgres:" +
    process.env.POSTGRES_PASSWORD + "@" + process.env.POSTGRES_PORT_5432_TCP_ADDR +
    ":5432/ratings_test?param=value";

console.log(process.env.POSTGRES_PORT_5432_TCP_ADDR +
":5432/ratings_test?param=value")

module.exports = config;
