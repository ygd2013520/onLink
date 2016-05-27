var exec = require('child_process').exec;
var async = require('async');

function puts(error, stdout, stderr) {
  if (error) {
    console.error('exec error: ' + error);
  } else if(stderr) {
    console.error('stderr: ' + stderr);
  } else {
    console.log('stdout: ' + stdout);
  }
}

// define all your service routines here: Python, Ruby, Java, C, C++, Perl, Lua, etc.
var tasks = [
  function() { exec("ls", puts); },
  function() { exec("ls", puts); },
  function() { exec("ls -la", puts); },
];

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