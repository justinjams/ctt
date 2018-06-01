import data from '../data/data.json'

import AI from './game/ai';
import User from './game/user';

const DEFAULT_RULES = {
  COMBO: false,
  ELEMENTAL: false,
  OPEN: true,
  PLUS: false,
  RANDOM: false,
  SAME: true,
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
    this.captureCard = this.captureCard.bind(this);
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

  checkSameRule(card, x, otherCard, y, neighbors) {
    if (this.rules.SAME) {
      const left = (x + 3) % 4;
      const leftCard = data.cards[this.grid[neighbors[left]]];
      const right = (x + 1) % 4;
      const rightCard = data.cards[this.grid[neighbors[right]]];

      console.log('checking same rule');
      console.log(leftCard, rightCard, card, otherCard)

      if(card.power[x] === otherCard.power[y] && (
          (leftCard && card.power[left] === leftCard.power[right]) ||
          (rightCard && card.power[left] === rightCard.power[right]))) {
        console.log('Same');
        return true;
      };
    } else return false;
  }

  captureCard (i, other, holding) {
    this.players[other.hand].score--;
    this.players[holding.hand].score++;
    other.hand = holding.hand;
    other.flipped = ['top', 'right', 'bottom', 'left'][i];
  }

  setCard (pos, holding, view) {
    if (!this.grid[pos]) {
      this.grid[pos] = {
        hand: holding.hand,
        card: this.players[holding.hand].hand[holding.pos]
      };
      const card = data.cards[this.players[holding.hand].hand.splice(holding.pos, 1)[0]];
      const neighbors = NEIGHBORS[pos];
      let sames = [];

      for(let i=0; i<4; i++) {
        const j = (i + 2) % 4;
        const other = this.grid[neighbors[i]];
        if(neighbors[i] !== null && other) {
          let otherCard = data.cards[other.card];
          console.log("Comparing", card.power[i], otherCard.power[j]);

          if(other.hand !== holding.hand && card.power[i] > otherCard.power[j]) {
            this.captureCard(i, other, holding);
          }

          if (this.rules.SAME && card.power[i] === otherCard.power[j]) {
            sames.push(i);
          }
        }
      }

      if (sames.length > 1) {
        for(let sameIndex of sames) {
          const other = this.grid[neighbors[sameIndex]];
          if(other.hand !== holding.hand) {
            this.captureCard(sameIndex, other, holding);
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