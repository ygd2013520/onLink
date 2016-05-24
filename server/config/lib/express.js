var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    path = require('path'),
    expressSession = require('express-session'),
    mongoStore = require('connect-mongo')(expressSession),
    flash = require('connect-flash');

var config = require('../config');

function initLocalVariables(app) {

}

function initSession(app, db) {
  app.use(expressSession({
    saveUninitialized: true,
    resave: true,
    secret: config.session.secret,
    cookie: {
      maxAge: config.session.cookie.maxAge,
      httpOnly: config.session.cookie.httpOnly,
      secure: config.session.cookie.secure
    },
    key: config.session.key,
    store: new mongoStore({
      mongooseConnection: db,
      collection: config.session.store.collection
    })
  }));
}

function initMiddleware(app) {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(flash());
}

function init500Route(app) {
  app.use(function(err, req, res, next) {
    if(err) {
      console.log(err.stack);
      res.redirect('/500Error')
    } else {
      next();
    }
  });
}

function init404Route(app) {
  app.use(function(req, res, next) {
    res.redirect('/404Error')
  });
}

function initModuleRoute(app) {
  config.files.routes.forEach(function (each) {
    require(path.resolve(each))(app);
  });
}

function initViewEngine(app) {
  var rootPath = path.resolve('node_modules/..');
  app.set('views', rootPath + '/modules');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.static(rootPath + '/../client/dist'));
}

function initModuleConfig(app) {
  config.files.moduleConfig.forEach(function (each) {
    require(path.resolve(each))(app);
  });
}

function init(db) {
  var app = express();
  initLocalVariables(app);
  initViewEngine(app);
  initSession(app, db);
  initMiddleware(app);
  initModuleConfig(app);
  initModuleRoute(app);
  init500Route(app);
  init404Route(app);

  return app;
}


module.exports.init = init;
