const mongoose = require('mongoose');

const Card = require('./card');
const User = require('./user');

const PlayerSchema = new mongoose.Schema({
  hand: [String],
  score: {
    default: 5,
    required: true,
    type: String
  },
  userId: {
    required: true,
    type: String
  }
});

class PlayerClass {

  toAttributes () {
    return {
      hand: this.hand.map((card) => new Card(card).toAttributes()),
      score: this.score,
      type: this.type,
      userId: this.userId
    };
  }

  toJson () {
    return JSON.stringify(this.toAttributes());
  }
}

PlayerSchema.statics.forUser = (userId, callback) => {
  User.findOne({ _id: userId }).exec((err, user) => {
    if (err) callback(err, user);
    Player.create({
      hand: user.hand.slice(),
      userId: userId
    }, callback);
  });
}

PlayerSchema.loadClass(PlayerClass);
const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;