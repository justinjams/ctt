const data = require('../data/data.json');
const DATA_KEYS = Object.keys(data.cards);

class Card {
  constructor (key, id) {
    this.data = data.cards[key];
    for(let dataKey of ['id', 'key', 'name', 'power']) {
      this[dataKey] = data.cards[key][dataKey]
    }

    if(id) {
      const index = id.split('').
                    map((e) => e.charCodeAt()).
                    reduce((m, v) => (m+v)%this.data.skins.length, 0);
      if (index > 0) {
        this.skinId = this.data.skins[index].num;
        //this.name = this.data.skins[index].name;
      }
    }

    this.toJson = this.toJson.bind(this);
  }

  toAttributes () {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      power: this.power,
      skinId: this.skinId
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