import data from '../data/data.json'

import AI from './game/ai';
import User from './game/user';

const DEFAULT_RULES = {
  ELEMENTAL: false,
  OPEN: true,
  PLUS: true,
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
    this.view = view;

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

  captureCard (i, pos, hand, neighbors) {
    const other = this.grid[pos];
    this.players[other.hand].score--;
    this.players[hand].score++;
    other.hand = hand;
    other.flipped = ['top', 'right', 'bottom', 'left'][i];
    console.log("Capturing", other.card, other.flipped);
  }

  setCard (options) {
    //console.log('setCard');
    //console.log(options);

    if (!this.grid[options.gridPos] || options.combo) {
      this.grid[options.gridPos] = this.grid[options.gridPos] || {};
      this.grid[options.gridPos].hand = options.hand;
      this.grid[options.gridPos].card = options.card;

      if (options.handPos !== null && options.handPos !== undefined) {
        this.players[options.hand].hand.splice(options.handPos, 1);
      }
      const card = data.cards[options.card];
      const neighbors = NEIGHBORS[options.gridPos];
      let sames = [];
      let pluses = [];

      for(let i=0; i<4; i++) {
        const j = (i + 2) % 4;
        const other = this.grid[neighbors[i]];
        if(neighbors[i] !== null && other && data.cards[other.card]) {
          let otherCard = data.cards[other.card];

          if(other.hand !== options.hand && card.power[i] > otherCard.power[j]) {
            this.captureCard(i, neighbors[i], options.hand, neighbors);
          }

          if (this.rules.PLUS) {
            let index = card.power[i] + otherCard.power[j];
            pluses[index] = pluses[index] || [];
            pluses[index].push(() => {
              if(options.hand === other.hand) return;
              this.captureCard(i, neighbors[i], options.hand, NEIGHBORS[neighbors[i]]);
              this.setCard({
                card: this.grid[neighbors[i]].card,
                gridPos: neighbors[i],
                hand: options.hand,
                combo: true
              });
            });
          }

          if (this.rules.SAME && card.power[i] === otherCard.power[j]) {
            sames.push(()=>{
              if(options.hand === other.hand) return;
              this.captureCard(i, neighbors[i], options.hand, NEIGHBORS[neighbors[i]]);
              this.setCard({
                card: this.grid[neighbors[i]].card,
                gridPos: neighbors[i],
                hand: options.hand,
                combo: true
              });
            });
          }
        }
      }

      if (sames.length > 1 && !options.combo) {
        this.sames.map((f)=>f());
        this.view.setHeadline('Same!', options.hand);
      }

      if (this.rules.PLUS && !options.combo) {
        for(let sum in pluses) {
          if (pluses[sum].length > 1) {
            pluses[sum].map((f)=>f());
            this.view.setHeadline('Plus!', options.hand);
          }
        }
      }

      if (!options.combo) {
        this.turn ++;
        
        if (this.isGameOver()) {
          let winner;
          if (this.players.player1.score > this.players.player2.score) winner = 'player1';
          else if (this.players.player1.score < this.players.player2.score) winner = 'player2';
          else winner = null;
          this.view.setGameOver(winner);
        } else if (this.getCurrentTurn() === 'player2') {
          this.players.player2.play(this.view);
        }
      }

      return true;
    }
  }
}
export default Game;