var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bcrypt;
try {
  bcrypt = require('bcrypt')
} catch (e) {
  bcrypt = require('bcryptjs');
}
const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  email: {
    type: String,
    required: 'email cannot be blank'
  },
  password: {
    type: String,
    required: 'password cannot be blank'
  },
  firstName: {
    type: String,
    required: 'firstName cannot be blank'
  },
  lastName: {
    type: String,
    required: 'lastName cannot be blank'
  },
  phone: {
    type: String
  }
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.checkPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if(err) { cb(err); }
    else {
      cb(null, isMatch);
    }
  });
};

mongoose.model('User', UserSchema);