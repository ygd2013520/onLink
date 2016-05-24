var passport = require('passport'),
    User = require('mongoose').model('User');



function renderIndex(req, res) {
  if(req.user) {
    res.render('../../client/src/index');
  } else {
    res.redirect('/login')
  }
}

function renderSignup(req, res) {
  res.render('common/views/signup', {alert: req.flash('signupInfo')[0]});
}

function signup(req, res, next) {
  User.findOne({'email': req.body.email}, function(err, user) {
    if(err) { return next(err) }
    if(user) {
      req.flash('signupInfo', 'Email has been registered');
      return res.redirect('/signup');
    } else {
      User.create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.phone
      }, function(err) {
        if(err) { return next(err) }
        else login(req, res, next);
      });
    }
  });

}

function renderLogin(req, res) {
  res.render('common/views/login', {alert: req.flash('loginInfo')[0]});
}

//TODO: handle error
function login(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('loginInfo', 'Invalid email or password');
      return res.redirect('/login');
    }
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
}

function logout(req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/');
}

function render500Error(req, res) {
  res.render('common/views/500');
}

function render404Error(req, res) {
  //For SPA, we redirect the 404 to home page
  //res.render('common/views/404');
  res.redirect('/');
}

function authenticateAPI(req, res, next) {
  if(req.user) {
    next();
  } else {
    res.json({Error: 'Request has not been authenticated'});
  }
}

function getUserInfo(req, res) {
  res.json(req.user);
}

module.exports.renderIndex = renderIndex;
module.exports.renderSignup = renderSignup;
module.exports.signup = signup;
module.exports.renderLogin = renderLogin;
module.exports.login = login;
module.exports.logout = logout;
module.exports.render500Error = render500Error;
module.exports.render404Error = render404Error;

module.exports.authenticateAPI = authenticateAPI;
module.exports.getUserInfo = getUserInfo;
