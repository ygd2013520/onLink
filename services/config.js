'use strict';

function initConfig () {
  var config = {};
  // define all your service here: Python, Ruby, Java, C, C++, Perl, Lua, etc.
  config.tasks = [
    "ls",
    "javac network/run.java",
    "random",
    "python storage/run.py",
    "node -v",
  ];

  return config;
}
module.exports = initConfig();
