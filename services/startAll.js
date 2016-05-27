var exec = require('child_process').exec;
var async = require('async');
var config = require('./config');

function puts(error, stdout, stderr) {
  if (error) {
    console.error(error);
  } else if(stderr) {
    console.error(stderr);
  } else {
    console.log(stdout);
  }
}

var tasks = [];
config.tasks.forEach(function(each){
  tasks.push(function() { exec(each, puts); });
});

async.parallel(tasks, function(err, results){
  if(err){
    console.log(err);
    console.log("*  Run tasks error!");
    process.exit(1);
  }
  else {
    console.log("*  Run tasks done!");
    process.exit(0);
  }
});