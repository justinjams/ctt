import data from './data.json'

class Game {
  constructor() {
    this.grid = [];
    const keys = Object.keys(data.cards);
    this.hand = [0,0,0,0,0].map(()=> keys[(Math.random() * keys.length)|0]);
    this.enemy = [0,0,0,0,0].map(()=> keys[(Math.random() * keys.length)|0]);
    console.log(this.hand);

    this.setCard = this.setCard.bind(this);
  }

  setCard(pos, holding) {
    if (!this.grid[pos]) {
      this.grid[pos] = {
        player: holding.hand,
        card: this[holding.hand][holding.pos]
      };
      let play = data.cards[this[holding.hand].splice(holding.pos, 1)[0]];
      let neighbors = Game.NEIGHBORS[pos];
      for(let i=0; i<4; i++) {
        let j = (i+2) % 4;
        let other = this.grid[neighbors[i]];
        if(neighbors[i] !== null &&
           other &&
           other.player !== holding.hand) {
          let otherCard = data.cards[other.card];
          if((i%2 === 0 && play.power[i] > otherCard.power[j]) ||
             (i%2 && play.power[i] < otherCard.power[j])) {
            other.player = holding.hand;
            other.flipped = ['top', 'right', 'bottom', 'left'][i];
          }
        }
      }

      return true;
    }
  }
}
Game.NEIGHBORS = [
  [null, 1, 3, null],
  [null, 2, 4, 0],
  [null, null, 5, 1],
  [0, 4, 6, null],
  [1, 5, 7, 3],
  [2, null, 8, 4],
  [3, 7, null, null],
  [4, 8, null, 6],
  [5, null, null, 7],
];
Game.x = [2, 3, 0, 1];
export default Game;