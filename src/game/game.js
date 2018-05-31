import data from '../data/data.json'

import AI from './game/ai';
import User from './game/user';

const DEFAULT_RULES = {
  COMBO: false,
  ELEMENTAL: false,
  OPEN: false,
  PLUS: false,
  RANDOM: false,
  SAME: false,
  SAME_WALL: false,
  SUDDEN_DEATH: false
}

const NEIGHBORS = [
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

class Game {
  constructor (view, rules) {
    this.grid = [];
    this.players = {
      player1: new User(),
      player2: new AI(this)
    };
    this.turn = 0;
    this.player2Starts = Math.round(Math.random());
    if(this.player2Starts) {
      this.players.player2.play(view);
    }
    this.rules = Object.assign(DEFAULT_RULES, rules);

    this.setCard = this.setCard.bind(this);
    this.setRule = this.setRule.bind(this);
  }

  setRule (rule, state) {
    this.rules[rule] = state;
  }

  isOpen () {
    return this.rules.OPEN;
  }

  isGameOver () {
    return (this.players.player1.hand.length + this.players.player2.hand.length) === 1
  }

  getCurrentTurn () {
    return ['player1', 'player2'][(this.turn + this.player2Starts)%2];
  }

  setCard (pos, holding, view) {
    if (!this.grid[pos]) {
      this.grid[pos] = {
        hand: holding.hand,
        card: this.players[holding.hand].hand[holding.pos]
      };
      const play = data.cards[this.players[holding.hand].hand.splice(holding.pos, 1)[0]];
      const neighbors = NEIGHBORS[pos];

      for(let i=0; i<4; i++) {
        let j = (i+2) % 4;
        let other = this.grid[neighbors[i]];
        if(neighbors[i] !== null &&
           other &&
           other.hand !== holding.hand) {
          let otherCard = data.cards[other.card];
          if(play.power[i] > otherCard.power[j]) {
            console.log(`Capture! ${play.power[i]} > ${otherCard.power[j]}`);
            this.players[other.hand].score--;
            this.players[holding.hand].score++;
            other.hand = holding.hand;
            other.flipped = ['top', 'right', 'bottom', 'left'][i];
          } else {
            console.log(`No capture! ${play.power[i]} <= ${otherCard.power[j]}`);
          }
        }
      }
      this.turn ++;
      if (this.getCurrentTurn() === 'player2' && !this.isGameOver()) {
        this.players.player2.play(view);
      }

      return true;
    }
  }
}
export default Game;