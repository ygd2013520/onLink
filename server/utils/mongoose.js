'use strict';

var mongoose = require('mongoose'),
    path = require('path'),
    config = require('../config/config');

var db;
var isConnectedBefore = false;

function loadModels() {
  config.files.models.forEach(function (each) {
    require(path.resolve(each));
  });
}

function init(callback) {
  loadModels();

  //db = mongoose.createConnection();
  //db.open(config.db.uri, {server: config.db.options});
  mongoose.connect(config.db.uri, {server: config.db.options});
  db = mongoose.connection;

  db.on('error', function() {
    console.log('\nCannot connect to MongoDB: ' + config.db.uri);
  });
  db.on('disconnected', function() {
    console.log('\nDisconnected from MongoDB: ' + config.db.uri);
    console.log('Retry connecting to MongoDB: ' + config.db.uri);
    setTimeout(function(){
      db.open(config.db.uri, {server: config.db.options});
    },config.db.reconnectInterval);
  });
  db.on('connected', function() {
    console.log('\nConnected to MongoDB: ' + config.db.uri);
    if(!isConnectedBefore && callback) callback(db);
    isConnectedBefore = true;
  })
}

//always create mongoose connection, can be used for initialization and testing
function start(callback) {
  isConnectedBefore = false;
  init(callback);
}

module.exports.init = init;
module.exports.start = start;
module.exports.db = db;
