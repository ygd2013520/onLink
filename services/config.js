'use strict';

function initConfig () {
  var config = {};
  // define all your service here: Python, Ruby, Java, C, C++, Perl, Lua, etc.
  config.tasks = [
    "javac network/run.java",
    "python storage/run.py",
    "node -v",
  ];

  return config;
}
module.exports = initConfig();
