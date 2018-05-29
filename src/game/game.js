import data from '../data/data.json'
const DATA_KEYS = Object.keys(data.cards);

class AI {
  constructor (game) {
    this.game = game;
    this.hand = [0,0,0,0,0].map(()=> DATA_KEYS[Math.floor(Math.random() * DATA_KEYS.length)]);
    this.score = 5;
  }

  play (view) {
    setTimeout(()=>{
      this.game.holding = { hand: 'enemy', pos: Math.floor(Math.random()*this.hand.length) };
      view.setState({ holding: this.game.holding });

      setTimeout(()=>{
        while(!this.game.setCard(Math.floor(Math.random()*9), this.game.holding)) {};
        view.setState({});
      }, 250);
    }, 0);
  }
}

class User {
  constructor () {
    this.hand = [0,0,0,0,0].map(()=> DATA_KEYS[Math.floor(Math.random() * DATA_KEYS.length)]);
    this.score = 5;
  }
}

class Game {
  constructor () {
    this.grid = [];
    this.players = {
      player: new User(),
      enemy: new AI(this)
    };
    this.turn = 0;

    this.setCard = this.setCard.bind(this);
  }

  setCard (pos, holding, view) {
    if (!this.grid[pos]) {
      this.grid[pos] = {
        hand: holding.hand,
        card: this.players[holding.hand].hand[holding.pos]
      };
      const play = data.cards[this.players[holding.hand].hand.splice(holding.pos, 1)[0]];
      const neighbors = Game.NEIGHBORS[pos];

      for(let i=0; i<4; i++) {
        let j = (i+2) % 4;
        let other = this.grid[neighbors[i]];
        if(neighbors[i] !== null &&
           other &&
           other.hand !== holding.hand) {
          let otherCard = data.cards[other.card];
          if((i%2 === 0 && play.power[i] > otherCard.power[j]) ||
             (i%2 && play.power[i] < otherCard.power[j])) {
            this.players[other.hand].score--;
            this.players[holding.hand].score++;
            other.hand = holding.hand;
            other.flipped = ['top', 'right', 'bottom', 'left'][i];
          }
        }
      }
      this.turn ++;
      if (this.turn%2 && this.turn < 9) {
        this.players.enemy.play(view);
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