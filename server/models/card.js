const data = require('../data/data.json');
const DATA_KEYS = Object.keys(data.cards);

class Card {
  constructor (key) {
    this.data = data.cards[key];
    for(let dataKey of ['id', 'key', 'name', 'power']) {
      this[dataKey] = data.cards[key][dataKey]
    }

    this.toJson = this.toJson.bind(this);
  }

  toAttributes () {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      power: this.power
    }
  }

  toJson () {
    return JSON.stringify(this.toAttributes());
  }
}

Card.random = () => {
  return DATA_KEYS[Math.floor(Math.random() * DATA_KEYS.length)];
};

module.exports = Card;