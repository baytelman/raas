var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/app');
var should = chai.should();

var projectsDao = require('../src/dao/projects');

/* Check we are NOT going to kill the main DB */
var config = require('../src/config');
if (config.db.url.indexOf('test') <= 0 && config.db.url.indexOf('travis') <= 0) {
    throw new Error("Tests can ONLY run with test db (ENV should be 'test')");
}

/*
 WHILE RUNNING TESTS, WE DISABLE "console.info"
 Use console.log or other functions (debug/error) to output to console during tests: */
console.info = function() {};

const TOKEN = "test_token_" + new Date().getTime();
const KEY_1 = 100;
const KEY_1B = 101;
const KEY_2 = 200;
const RATE_GOOD = 5;
const RATE_OK = 3;
const RATE_BAD = 1;
const USER_ID = 9;

var tokenCount = 0;
var currentToken = null;

chai.use(chaiHttp);

describe('Projects', function() {
    beforeEach(function(done){
        projectsDao.insertNewProject(function(projectId) {
            projectsDao.getAccessTokenForProject(projectId, function(accessToken) {
                currentToken = accessToken;
                done();
            });
        });
    });
    it('should create the PROJECTS and TOKENS', function(done) {
        chai.request(server)
            .put('/api/v1/projects?email=test@test')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('project_id');
                res.body.should.have.property('email');
                done();
            });
    });
});

describe('Ratings', function() {
    beforeEach(function(done){
        projectsDao.insertNewProject(function(projectId) {
            projectsDao.getAccessTokenForProject(projectId, function(accessToken) {
                currentToken = accessToken;
                done();
            });
        });
    });
    it('should insert a SINGLE rating on /ratings PUT', function(done) {
        chai.request(server)
            .put('/api/v1/ratings?token=' + currentToken + '&user=' + USER_ID + '&rating=' + RATE_GOOD + '&key1=' + KEY_1)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
    it('putting a GOOD RATING will provide GOOD RATING average', function(done) {
        chai.request(server)
            .put('/api/v1/ratings?token=' + currentToken + '&user=' + USER_ID + '&rating=' + RATE_GOOD + '&key1=' + KEY_1)
            .end(function(err, res){
                chai.request(server)
                    .get('/api/v1/ratings?token=' + currentToken + '&key1=' + KEY_1)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('stats');
                        res.body.stats.should.have.property('average');
                        res.body.stats.should.have.property('count');
                        res.body.stats.should.have.property('stddev');
                        res.body.stats.should.have.property('variance');
                        res.body.stats.average.should.equal(RATE_GOOD);
                        res.body.stats.count.should.equal(1);
                        done();
                    });
            });
    });
    it('RATINGS go to the right type of key', function(done) {
        chai.request(server)
            .put('/api/v1/ratings?token=' + currentToken + '&user=' + USER_ID + '&rating=' + RATE_GOOD + '&key1=' + KEY_1)
            .end(function(err, res){
                chai.request(server)
                    .put('/api/v1/ratings?token=' + currentToken + '&user=' + USER_ID + '&rating=' + RATE_BAD + '&key2=' + KEY_2)
                    .end(function(err, res){
                        chai.request(server)
                            .put('/api/v1/ratings?token=' + currentToken + '&user=' + USER_ID + '&rating=' + RATE_OK + '&key1=' + KEY_1 + '&key2=' + KEY_2)
                            .end(function(err, res){
                                /* KEY 1 = 4 */
                                chai.request(server)
                                    .get('/api/v1/ratings?token=' + currentToken + '&key1=' + KEY_1)
                                    .end(function(err, res) {
                                        res.should.have.status(200);
                                        res.should.be.json;
                                        res.body.should.be.a('object');
                                        res.body.should.have.property('stats');
                                        res.body.stats.should.have.property('average');
                                        res.body.stats.should.have.property('count');
                                        res.body.stats.should.have.property('count5');
                                        res.body.stats.should.have.property('count1');
                                        res.body.stats.average.should.equal((RATE_GOOD + RATE_OK)/2.0);
                                        res.body.stats.count.should.equal(2);
                                        res.body.stats.count5.should.equal(1);
                                        res.body.stats.count3.should.equal(1);
                                        res.body.stats.count1.should.equal(0);

                                        res.body.stats.should.have.property('stddev');
                                        res.body.stats.should.have.property('variance');
                                        res.body.stats.variance.should.equal(2);
                                        res.body.stats.stddev.should.not.equal(1);

                                        /* KEY 2 = 2 */
                                        chai.request(server)
                                            .get('/api/v1/ratings?token=' + currentToken + '&key2=' + KEY_2)
                                            .end(function(err, res) {
                                                res.should.have.status(200);
                                                res.should.be.json;
                                                res.body.should.be.a('object');
                                                res.body.should.have.property('stats');
                                                res.body.stats.should.have.property('average');
                                                res.body.stats.should.have.property('count');
                                                res.body.stats.should.have.property('count5');
                                                res.body.stats.should.have.property('count1');
                                                res.body.stats.average.should.equal((RATE_BAD + RATE_OK)/2.0);
                                                res.body.stats.count.should.equal(2);
                                                res.body.stats.count5.should.equal(0);
                                                res.body.stats.count1.should.equal(1);

                                                done();
                                            });
                                    });
                            });
                    });
            });
    });
    it('RATINGS go to the right value', function(done) {
        chai.request(server)
            .put('/api/v1/ratings?token=' + currentToken + '&user=' + USER_ID + '&rating=' + RATE_GOOD + '&key1=' + KEY_1)
            .end(function(err, res){
                chai.request(server)
                    .put('/api/v1/ratings?token=' + currentToken + '&user=' + USER_ID + '&rating=' + RATE_OK + '&key1=' + KEY_1B)
                    .end(function(err, res){
                        /* KEY 1 */
                        chai.request(server)
                            .get('/api/v1/ratings?token=' + currentToken + '&key1=' + KEY_1)
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.body.stats.count5.should.equal(1);
                                res.body.stats.count3.should.equal(0);

                                /* KEY 1B */
                                chai.request(server)
                                    .get('/api/v1/ratings?token=' + currentToken + '&key1=' + KEY_1B)
                                    .end(function(err, res) {
                                        res.should.have.status(200);
                                        res.body.stats.count5.should.equal(0);
                                        res.body.stats.count3.should.equal(1);

                                        done();
                                    });
                            });
                    });
            });
    });
});

describe('Reviews', function() {
    beforeEach(function(done){
        projectsDao.insertNewProject(function(projectId) {
            projectsDao.getAccessTokenForProject(projectId, function(accessToken) {
                currentToken = accessToken;
                done();
            });
        });
    });
    it('New project has no reviews', function(done) {
        chai.request(server)
            .get('/api/v1/reviews?token=' + currentToken + '&key2=' + KEY_2)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('reviews');
                res.body.reviews.should.be.empty;

                done();
            });
    });
    it('should insert a SINGLE reviews on /reviews PUT', function(done) {
        var review = {
            title: "Test review title",
            body: "Test review body",
        };
        chai.request(server)
            .post('/api/v1/reviews?token=' + currentToken + '&user=' + USER_ID + '&key1=' + KEY_1)
            .send(review)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');

                chai.request(server)
                    .get('/api/v1/reviews?token=' + currentToken + '&key1=' + KEY_1)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('reviews');
                        res.body.reviews.should.be.not.empty;
                        res.body.reviews[0].should.deep.equal(review);
                        done();
                    });
            });
    });
});
