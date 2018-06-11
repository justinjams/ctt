const Card = require('./card');

class Player {
  constructor () {
    this.type = 'user';
    this.hand = [0,0,0,0,0].map(Card.random);
    this.score = 5;
    
    this.toJson = this.toJson.bind(this);
    this.toAttributes = this.toAttributes.bind(this);
  }

  toAttributes () {
    return {
      hand: this.hand.map((card) => card.toAttributes()),
      score: this.score,
      type: this.type,
      userId: 1
    };
  }

  toJson () {
    return JSON.stringify(this.toAttributes());
  }
}

module.exports = Player;