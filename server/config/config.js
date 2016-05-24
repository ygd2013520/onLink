'use strict';

function initConfig () {
  var config = {};
  // host and port
  config.host = process.env.HOST || '0.0.0.0';
  config.port = process.env.PORT || 3000;

  // database
  config.db = {
    uri: 'mongodb://localhost:27017/test',
    options: {
      auto_reconnect: false, //control the reconnect in mongoose.js
      poolSize: 100,
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
    },
    reconnectInterval: 3000                           //in ms
  };

  if(process.env.MONGODB_URI) {
    config.db.uri = process.env.MONGODB_URI;
  }

  // files
  config.files = { };
  config.files.models = [
    'modules/common/models/user.js'
  ];
  config.files.routes = [
    'modules/common/routes/common.routes.js'
  ];
  config.files.moduleConfig = [
    'modules/common/config/common.config.js'
  ];

  config.session = {
    secret: process.env.SESSION_SECRET || 'dsf**&&sdfssfsdsdglkjljwlkj12&^^133',
    cookie: {
      maxAge: 1 * (60 * 60 * 1000), //1 hours
      httpOnly: true,
      secure: false
    },
    store: {    // used only for store session
      collection: 'sessions'
    },
    key: 'sessionId'
  };

  return config;
}

module.exports = initConfig();
