var mongoose = require('mongoose');
var mongodb = require('mongodb');


var dbUrl = process.env.MONGOLAB_OLIVE_URI || 'mongodb://heroku_p88gzmqn:nqivr54q8p6supmva10jfl4jbn@ds111748.mlab.com:11748/heroku_p88gzmqn';

mongoose.connect(dbUrl, function (err, res) {
  if (err) console.error('ERROR connecting to: ' + dbUrl + '. ' + err)
  else console.log('Successfully connected to: ' + dbUrl)
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongodb connection open');
});

module.exports = db;
