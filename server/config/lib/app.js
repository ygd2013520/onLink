var config = require('../config'),
    mongoose = require('./../../utils/mongoose'),
    rpcClient = require('./../../utils/rabbitRpcClient'),
    express = require('./express');

function init(callback) {
  console.log("Prepare to start the server:\nPlease make sure both mongodb and rabbitmq server are running.");
  mongoose.init(function(db) {
    rpcClient.init();
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



