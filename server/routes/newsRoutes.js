//GET request for external NYT API

var express = require('express');
var request = require('request');
var router = express.Router();
var bodyParser = require('body-parser');
// var apiKey = '';
//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));


router.get('/Large', (req, res) => {
  var reqUrl = 'http://api.nytimes.com/svc/news/v3/content/'
    + req.query.source + '/'
    + req.query.section + '/'
    + req.query.time + '.json'
    + '?limit=' + req.query.limit
    + '&offset=' + req.query.offset;

  var options = {
    method: 'GET',
    qs:{'api-key': '1129af89a83442588dd60adbf51b6548'},
    url: reqUrl
  };
  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send(body);
  });

});

module.exports = router;
