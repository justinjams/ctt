const AI = require('./ai');
const User = require('./user');

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
  constructor (props) {
    this.grid = [];
    this.players = [
      new User(),
      new User() //AI(this)
    ];
    this.totalTurn = 0;
    this.startPlayer = Math.round(Math.random());
    this.rules = Object.assign(DEFAULT_RULES, props.rules || {});
    this.id = props.id;

    this.toJson = this.toJson.bind(this);
    this.captureCard = this.captureCard.bind(this);
  }

  toAttributes () {
    const gridAttributes = this.grid.map((item) => {
      if (item) {
        return {
          card: item.card.toAttributes(),
          flipped: item.flipped,
          hand: item.hand
        }
      }
    });
    return {
      grid: gridAttributes,
      id: this.id,
      players: [
        this.players[0].toAttributes(),
        this.players[1].toAttributes()
      ],
      rules: this.rules,
      turn: (this.totalTurn + this.startPlayer) % 2
    };
  }

  toJson () {
    return JSON.stringify(this.toAttributes());
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
    if (!this.grid[options.gridPos] || options.combo) {
      const card = this.players[options.hand].hand[options.handPos];
      this.grid[options.gridPos] = this.grid[options.gridPos] || {};
      this.grid[options.gridPos].hand = options.hand;
      this.grid[options.gridPos].card = card;

      if (options.handPos !== null && options.handPos !== undefined) {
        this.players[options.hand].hand.splice(options.handPos, 1);
      }
      const neighbors = NEIGHBORS[options.gridPos];
      let sames = [];
      let pluses = [];

      for(let i = 0; i < 4; i++) {
        const j = (i + 2) % 4;
        const other = this.grid[neighbors[i]];
        if(neighbors[i] !== null && other && other.card) {

          if(other.hand !== options.hand && card.power[i] > other.card.power[j]) {
            this.captureCard(i, neighbors[i], options.hand, neighbors);
          }

          if (this.rules.PLUS) {
            let index = card.power[i] + other.card.power[j];
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

          if (this.rules.SAME && card.power[i] === other.card.power[j]) {
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
        this.totalTurn ++;
        
        if (this.isGameOver()) {
          let winner;
          if (this.players.player1.score > this.players.player2.score) winner = 'player1';
          else if (this.players.player1.score < this.players.player2.score) winner = 'player2';
          else winner = null;
          this.view.setGameOver(winner);
        }
      }

      return true;
    }
  }

  isGameOver () {
    return (this.players[0].hand.length + this.players[1].hand.length) === 1
  }
}

module.exports = Game;