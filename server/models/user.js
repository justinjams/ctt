const data = require('../data/data.json');
const DATA_KEYS = Object.keys(data.cards);

const Card = require('./card');

class User {
  constructor () {
    this.type = 'user';
    this.hand = [0,0,0,0,0].map(Card.random);
    this.score = 5;
    this.toJson = this.toJson.bind(this);
  }

  toAttributes () {
    return {
      hand: this.hand.map((card) => card.toAttributes()),
      score: this.score,
      type: this.type
    };
  }

  toJson () {
    return JSON.stringify(this.toAttributes());
  }
}
module.exports = User;