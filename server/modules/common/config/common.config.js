var    passport = require('passport'),
       LocalStrategy = require('passport-local').Strategy;
       User = require('mongoose').model('User');

function init(app) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      user.password = undefined;
      user._id = undefined;
      user.__v = undefined;
      done(err, user);
    });
  });

  passport.use('local',new LocalStrategy( {
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          user.checkPassword(password, function(err, isMatch) {
            if(err) { return done(err); }
            else if(isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password.' });
            }
          });
        });
      }
  ));

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = init;
