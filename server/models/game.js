const mongoose = require('mongoose');

const data = require('../../server/data/data.json');
const DATA_KEYS = Object.keys(data.cards);

const Card = require('./card');
const User = require('./user');

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

const GameLogSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

const GameSchema = new mongoose.Schema({
  ai: {
    type: String
  },
  state: {
    default: 'created',
    type: String,
    required: true
  },
  grid: {
    default: [...Array(9)].map(() => null),
    required: true,
    type: [{
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
    }]
  },  
  hands: [[String]],
  profileIcons: [[Number]],
  names: [[String]],
  log: [GameLogSchema],
  rules: {
    default: DEFAULT_RULES,
    type: Object,
    required: true
  },
  scores: {
    default: [5, 5],
    type: [Number],
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
  userIds: [String]
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
      hands: this.hands.map((hand) =>
       hand.map((key) => new Card(key).toAttributes())
      ),
      id: this.id,
      log: this.log,
      profileIcons: this.profileIcons,
      names: this.names,
      rules: this.rules,
      state: this.state,
      scores: this.scores,
      turn: this.turn,
      updatedAt: this.updatedAt,
      userIds: this.userIds
    };
  }

  get turn() {
    return (this.totalTurn + this.startPlayer) % 2;
  }

  toJson () {
    return JSON.stringify(this.toAttributes());
  }

  captureCard (i, pos, hand, neighbors) {
    const other = this.grid[pos];
    this.scores[other.hand] --;
    this.scores[hand] ++;
    other.hand = hand;
    other.flipped = ['top', 'right', 'bottom', 'left'][i];
  }

  aiMove() {
    //return callback();
    if (this.state === 'active' && this.userIds[this.turn] == 0) {
      let pos = Math.floor(Math.random()*9);
      while(this.grid[pos]) pos = Math.floor(Math.random()*9);
      this.setCard({
        gridPos: pos,
        hand: this.turn,
        handPos: 0
      });
      //this.players[this.turn].play(this);
    }
  }

  setCard (options) {
    if (options.hand == this.turn && (options.combo || !this.grid[options.gridPos])) {
      let count = 0;
      const card = new Card(options.cardId || this.hands[options.hand][options.handPos]);
      this.grid[options.gridPos] = this.grid[options.gridPos] || {};
      this.grid[options.gridPos].hand = options.hand;
      this.grid[options.gridPos].cardId = card.key;
      // if (!options.combo) {
      //   for(let obj of this.grid) {
      //     if (obj) obj.flipped = '';
      //   }
      // }

      if (options.handPos !== null && options.handPos !== undefined) {
        this.hands[options.hand].splice(options.handPos, 1);
      }
      const neighbors = NEIGHBORS[options.gridPos];
      let sames = [];
      let pluses = [];

      for(let i = 0; i < 4; i++) {
        const j = (i + 2) % 4;
        const other = this.grid[neighbors[i]];
        if(neighbors[i] !== null && other && other.cardId) {
          const otherCard = new Card(other.cardId);
          if(other.hand !== options.hand && card.power[i] > otherCard.power[j]) {
            this.captureCard(i, neighbors[i], options.hand, neighbors);
            count++;
          }

          if (this.rules.PLUS) {
            let index = card.power[i] + otherCard.power[j];
            pluses[index] = pluses[index] || [];
            pluses[index].push(() => {
              if(options.hand === other.hand) return;
              count ++;
              this.captureCard(i, neighbors[i], options.hand, NEIGHBORS[neighbors[i]]);
              count += this.setCard({
                cardId: this.grid[neighbors[i]].cardId,
                combo: true,
                gridPos: neighbors[i],
                hand: options.hand
              });
            });
          }

          if (this.rules.SAME && card.power[i] === otherCard.power[j]) {
            sames.push(() => {
              if(options.hand === other.hand) return;
              count ++;
              this.captureCard(i, neighbors[i], options.hand, NEIGHBORS[neighbors[i]]);
              count += this.setCard({
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
        this.log.push({ message: `:P${options.hand}: activated SAME!` });
        this.sames.map((f)=>f());
        //this.view.setHeadline('Same!', options.hand);
      }

      if (this.rules.PLUS && !options.combo) {
        for(let sum in pluses) {
          if (pluses[sum].length > 1) {
            this.log.push({ message: `:P${options.hand}: activated PLUS!` });
            pluses[sum].map((f)=>f());
            //this.view.setHeadline('Plus!', options.hand);
          }
        }
      }

      if (!options.combo) {
        this.totalTurn ++;
        
        if (this.isGameOver()) {
          let winner;
          if (this.scores[0] > this.scores[1]) winner = 'player1';
          else if (this.scores[0] < this.scores[1]) winner = 'player2';
          else winner = null;
          //this.view.setGameOver(winner);
        }
      }

      if (count > 0) {
        let s = count > 1 ? 's' : '';
        this.log.push({ message: `:P${options.hand}: captured ${count} card${s}!` });
      }

      if (this.hands[0].length + this.hands[1].length === 1) {
        this.state = 'finished';
      }
      return count;
    } else {
      return false;
    }
  }

  isGameOver () {
    return (this.hands[0].length + this.hands[1].length) === 1
  }
}

GameSchema.loadClass(GameClass);

GameSchema.statics.start = (gameData, callback) => {
  User.findOne({ _id: gameData.userId }).exec((err, user) => {
    const userIds = [gameData.userId];
    const params = {
      hands: [user.hand.slice()],
      profileIcons: [user.profileIcon],
      names: [user.username],
      rules: Object.assign({}, DEFAULT_RULES, gameData.rules), 
      startPlayer: Math.round(Math.random()),
      userIds: userIds
    };

    if (gameData.solo) {
      params.state = 'active';
      params.ai = 1;
      params.names.push('Fake Mark');
      params.userIds.push(0);
      params.hands.push([0,0,0,0,0].map(()=> DATA_KEYS[Math.floor(Math.random() * DATA_KEYS.length)]));
      params.profileIcons.push(712 + Math.round(Math.random()));
    }
    Game.create(params, callback);
  });
};
const GameLog = mongoose.model('GameLog', GameLogSchema);
const Game = mongoose.model('Game', GameSchema);
module.exports = Game;