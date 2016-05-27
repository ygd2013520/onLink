var shell = require('shelljs');
var config = require('./config');

config.tasks.forEach(function(each){
  shell.exec(each, {async: true});
});


