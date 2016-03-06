var express = require('express');
var ratingsDao = require('./src/dao/ratings.js');

var app = express();

app.get('/', function (req, res) {
    getCurrentTime(function(time) {
        insertRating('felipe', 5.0, 1, 2, 3, function(success) {
            res.send('Review added! ' + time);
        });
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
