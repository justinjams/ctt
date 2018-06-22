const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const USERNAME_REGEX = /^[a-z0-9_-]{3,15}$/;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: 'Email is already in use.',
    required: true,
    trim: true,
    validate: {
      validator: ((v) => EMAIL_REGEX.test(v)),
      message: 'Email is invalid.'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: ((v) => PASSWORD_REGEX.test(v)),
      message: 'Password must be more complex. Try adding a special character.'
    }
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: ((v) => USERNAME_REGEX.test(v)),
      message: 'Username should be 3-17 letters and numbers.'
    }
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('Email or username already in use.')); 
    }
    else next(error);
});

UserSchema.statics.authenticate = function (userData, callback) {
  User.findOne({ username: userData.username }).exec(function (err, user) {
    if (err) {
      return callback(err)
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }

    bcrypt.compare(userData.password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        const err = new Error('Invalid credentials.');
        err.status = 403;
        return callback(err);
      }
    })
  });
}

const User = mongoose.model('User', UserSchema);
module.exports = User;