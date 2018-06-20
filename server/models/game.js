const mongoose = require('mongoose');

const AI = require('./ai');
const Player = require('./player');
const Card = require('./card');
const STATES = [
  'created',
  'active',
  'finished'
];
const DEFAULT_RULES = {
//  ELEMENTAL: false,
  OPEN: false,
  PLUS: false,
//  RANDOM: false,
  SAME: false,
//  SAME_WALL: false,
//  SUDDEN_DEATH: false
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

const GridSchema = new mongoose.Schema({
  cardId: {
    type: String,
    required: true
  },
  flipped: {
    type: String,
  },
  hand: {
    type: Number,
    required: true
  }
});

const GameSchema = new mongoose.Schema({
  state: {
    default: 'created',
    type: String,
    required: true
  },
  grid: [GridSchema],
  players: [Player.schema],
  userIds: [String],
  rules: {
    default: DEFAULT_RULES,
    type: Object,
    required: true
  },
  startPlayer: {
    type: Number,
    required: true
  },
  totalTurn: {
    default: 0,
    type: Number,
    required: true
  },
}, { timestamps: true });

class GameClass {
  toAttributes () {
    const gridAttributes = this.grid.map((item) => {
      if (item) {
        return {
          card: new Card(item.cardId).toAttributes(),
          flipped: item.flipped,
          hand: item.hand
        }
      }
    });
    return {
      createdAt: this.createdAt,
      grid: gridAttributes,
      id: this.id,
      players: this.players.map((p) => p.toAttributes()),
      rules: this.rules,
      state: this.state,
      turn: (this.totalTurn + this.startPlayer) % 2,
      updatedAt: this.updatedAt
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

  setCard (options, callback) {
    if (!this.grid[options.gridPos] || options.combo) {
      const card = new Card(options.cardId || this.players[options.hand].hand[options.handPos]);
      this.grid[options.gridPos] = this.grid[options.gridPos] || {};
      this.grid[options.gridPos].hand = options.hand;
      this.grid[options.gridPos].cardId = card.key;
      if (!options.combo) {
        for(let obj of this.grid) {
          if (obj) obj.flipped = '';
        }
      }

      if (options.handPos !== null && options.handPos !== undefined) {
        this.players[options.hand].hand.splice(options.handPos, 1);
      }
      const neighbors = NEIGHBORS[options.gridPos];
      let sames = [];
      let pluses = [];

      for(let i = 0; i < 4; i++) {
        const j = (i + 2) % 4;
        const other = this.grid[neighbors[i]];
        if(neighbors[i] !== null && other && other.cardId) {
          const otherCard = new Card(other.cardId);
          console.log(other, options);
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
                cardId: this.grid[neighbors[i]].cardId,
                combo: true,
                gridPos: neighbors[i],
                hand: options.hand
              });
            });
          }

          if (this.rules.SAME && card.power[i] === other.card.power[j]) {
            sames.push(()=>{
              if(options.hand === other.hand) return;
              this.captureCard(i, neighbors[i], options.hand, NEIGHBORS[neighbors[i]]);
              this.setCard({
                cardId: this.grid[neighbors[i]].cardId,
                combo: true,
                gridPos: neighbors[i],
                hand: options.hand
              });
            });
          }
        }
      }

      if (sames.length > 1 && !options.combo) {
        this.sames.map((f)=>f());
        //this.view.setHeadline('Same!', options.hand);
      }

      if (this.rules.PLUS && !options.combo) {
        for(let sum in pluses) {
          if (pluses[sum].length > 1) {
            pluses[sum].map((f)=>f());
            //this.view.setHeadline('Plus!', options.hand);
          }
        }
      }

      if (!options.combo) {
        this.totalTurn ++;
        
        if (this.isGameOver()) {
          let winner;
          if (this.players[0].score > this.players[1].score) winner = 'player1';
          else if (this.players[0].score < this.players[1].score) winner = 'player2';
          else winner = null;
          //this.view.setGameOver(winner);
        }
      }

      this.save((err) => {
        if(err) return callback(err);
        callback(null, true);
      });
    } else {
      callback('Invalid move');
    }
  }

  isGameOver () {
    return (this.players[0].hand.length + this.players[1].hand.length) === 1
  }
}

GameSchema.loadClass(GameClass);

GameSchema.statics.start = (gameData, callback) => {
  Player.forUser(gameData.userId, (err, player) => {
    const players = [player];
    const userIds = [gameData.userId];
    const params = {
      players: players,
      rules: Object.assign({}, DEFAULT_RULES, gameData.rules), 
      startPlayer: Math.round(Math.random()),
      userIds: userIds
    };

    if (gameData.solo) {
      players.push(player);
      userIds.push(gameData.userId);
      params.state = 'active';
    }
    Game.create(params, callback);
  });
};

const Game = mongoose.model('Game', GameSchema);
module.exports = Game;