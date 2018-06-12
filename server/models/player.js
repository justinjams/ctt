const mongoose = require('mongoose');

const Card = require('./card');

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
  Player.create({
    hand: [0,0,0,0,0].map(Card.random),
    userId: userId
  }, callback);
}

PlayerSchema.loadClass(PlayerClass);
const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;