const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
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
        return callback();
      }
    })
  });
}

const User = mongoose.model('User', UserSchema);
module.exports = User;