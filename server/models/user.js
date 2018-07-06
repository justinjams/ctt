const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /(?=^.{6,}$).*$/;
const USERNAME_REGEX = /^[a-z0-9_-]{3,15}$/;

const Card = require('./card');

const UserSchema = new mongoose.Schema({
  cards: [String],
  hand: [String],
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
      message: 'Password must be at least 6 characters long.'
    }
  },
  profileIcon: {
    type: Number,
    // TODO: Figure out how to require this
    //required: true,
    validate: {
      validator: ((v) => PROFILE_ICONS.indexOf(v) > -1),
      message: 'Profile icon selection invalid.'
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
}, { timestamps: true });

const PROFILE_ICONS = [...Array(29)].map((_, i)=>i);

UserSchema.pre('save', function (next) {
  const user = this;
  if(user.isNew) {
    user.cards = [...Array(7)].reduce((memo, v, i) => {
      let random;
      while(memo.indexOf(random = Card.random()) > -1);
      memo[i] = random;
      return memo;
    }, []);
    user.hand = user.cards.slice(0, 5);
    user.profileIcon = PROFILE_ICONS[parseInt(PROFILE_ICONS.length * Math.random())];

    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email or username already in use.')); 
  }
  else next(error);
});

UserSchema.statics.authenticate = (userData, callback) => {
  User.findOne({ username: userData.username }).exec((err, user) => {
    if (err) {
      return callback(err)
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }

    bcrypt.compare(userData.password, user.password, (err, result) => {
      if (result === true) {
        return callback(null, user);
      } else {
        const err = new Error('Invalid credentials.');
        err.status = 403;
        return callback(err);
      }
    })
  });
};

class UserClass {
  toAttributes () {
    return {
      id: this.id,
      cards: this.cards.map((key) => new Card(key, this.id).toAttributes()),
      hand: this.hand.map((key) => new Card(key, this.id).toAttributes()),
      profileIcon: this.profileIcon,
      username: this.username
    }
  }
}
UserSchema.loadClass(UserClass);

const User = mongoose.model('User', UserSchema);

module.exports = User;