var config = require('../config'),
    mongoose = require('./../../utils/mongoose'),
    express = require('./express');

function init(callback) {
  mongoose.init(function(db) {
    var app = express.init(db);
    if (callback) callback(app, config, db);
  });
}

function start() {
  init(function (app, config, db){
    app.listen(config.port, config.host, function () {
      var server = 'http://' + config.host + ':' + config.port;
      console.log('\nServer is running:%s\n', server);
    });
  });
}

module.exports.start = start;



