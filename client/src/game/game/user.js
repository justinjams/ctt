import data from '../../data/data.json'
const DATA_KEYS = Object.keys(data.cards);

class User {
  constructor () {
    this.type = 'user';
    this.hand = [0,0,0,0,0].map(()=> DATA_KEYS[Math.floor(Math.random() * DATA_KEYS.length)]);
    this.score = 5;
  }
}
export default User;