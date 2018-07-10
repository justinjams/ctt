const mongoose = require('mongoose');

const data = require('../../server/data/data.json');
const DATA_KEYS = Object.keys(data.cards);

const Card = require('./card');
const User = require('./user');

const AI = {
  ALDOUS: 1,
  BART: 2
};

const STATES = [
  'created',
  'active',
  'finished'
];
const DEFAULT_RULES = {
//  ELEMENTAL: false,
  OPEN: true,
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
    type: Number
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
  usernames: [[String]],
  log: [GameLogSchema],
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
  userIds: [String],
  winner: {
    type: Number
  }
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
      usernames: this.usernames,
      rules: this.rules,
      state: this.state,
      scores: this.scores,
      turn: this.turn,
      updatedAt: this.updatedAt,
      userIds: this.userIds,
      winner: this.winner
    };
  }

  get turn() {
    return (this.totalTurn + this.startPlayer) % 2;
  }

  get scores() {
    let l = 0;
    let r = 0;
    this.grid.forEach((b) => {
      if(b) {
        l += b.hand === 0;
        r += b.hand === 1;
      }
    });
    let result = [this.hands[0].length + l];
    if(this.hands[1]) result.push(this.hands[1].length + r);
    return result;
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

  randomAiMove() {
    let pos = Math.floor(Math.random()*9);
    while(this.grid[pos]) pos = Math.floor(Math.random()*9);
    this.setCard({
      gridPos: pos,
      hand: this.turn,
      handPos: 0
    });
  }

  aiMove() {
    if (this.state === 'active' && this.userIds[this.turn] == 0) {

      if (this.ai === AI.ALDOUS) {
        this.randomAiMove();
      } else if (this.ai === AI.BART) {
        const BART_TRIES = 5;
        let moved = false;
        for(let handPos = 0; handPos < this.hands[1].length; handPos++) {
          const card = new Card(this.hands[1][handPos]);

          // 5 tries at finding a good spot
          for(let i = 0; i < BART_TRIES; i++) {
            let pos = Math.floor(Math.random()*9);
            const neighbors = NEIGHBORS[pos];
            if (!this.grid[pos]) {
              for(let j = 0; j < 4; j++) {
                const k = (j + 2) % 4;
                const other = this.grid[neighbors[j]];
                if(neighbors[i] !== null && other && other.cardId) {
                  const otherCard = new Card(other.cardId);
                  if(other.hand !== 1 && card.power[j] > otherCard.power[k]) {
                    this.setCard({
                      gridPos: pos,
                      hand: 1,
                      handPos: handPos
                    });
                    j=4;
                    i=BART_TRIES;
                    moved = true;
                    break;
                  }
                }
              }
            }
          }
        }
        if(!moved) this.randomAiMove();
      }
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
        sames.map((f)=>f());
      }

      if (this.rules.PLUS && !options.combo) {
        for(let sum in pluses) {
          if (pluses[sum].length > 1) {
            this.log.push({ message: `:P${options.hand}: activated PLUS!` });
            pluses[sum].map((f)=>f());
          }
        }
      }

      if (!options.combo) {
        this.totalTurn ++;
      }
        
      if (this.isGameOver()) {
        if (this.scores[0] > this.scores[1]) this.winner = 0;
        else if (this.scores[0] < this.scores[1]) this.winner = 1;
        else this.winner = -1;
      }

      if (count > 0) {
        let s = count > 1 ? 's' : '';
        this.log.push({ message: `:P${options.hand}: captured ${count} card${s}!` });
      }

      if (this.hands[0].length + this.hands[1].length === 1) {
        if(this.state != 'finished') {
          let winnerText;
          if (this.winner === -1) {
            winnerText = "It's a draw!"
          } else {
            winnerText = `:P${this.winner}: wins!`;
          }
          this.log.push({ message: `Game over. ${winnerText}`});
        }
        this.state = 'finished';
      } else {
        this.logTurn();
      }
      return count;
    } else {
      return false;
    }
  }

  isGameOver () {
    return (this.hands[0].length + this.hands[1].length) === 1;
  }

  logTurn () {
    this.log.push({ message: `:P${this.turn}:, it's your turn!` });
  }
}

GameSchema.loadClass(GameClass);

GameSchema.statics.start = (gameData, callback) => {
  User.findOne({ _id: gameData.userId }).exec((err, user) => {
    const userIds = [gameData.userId];
    const params = {
      hands: [user.hand.slice()],
      profileIcons: [user.profileIcon],
      usernames: [user.username],
      rules: Object.assign({}, DEFAULT_RULES, gameData.rules), 
      startPlayer: Math.round(Math.random()),
      userIds: userIds
    };

    if (gameData.ai > 0) {
      params.ai = gameData.ai;
      params.state = 'active'
      params.userIds.push(0);
      params.hands.push([0,0,0,0,0].map(()=> DATA_KEYS[Math.floor(Math.random() * DATA_KEYS.length)]));

      switch(gameData.ai) {
        case 1:
          params.usernames.push('Aldous');
          params.profileIcons.push(712);
          break;
        case 2:
          params.usernames.push('Bart');
          params.profileIcons.push(713);
          break;
      }
    }
    Game.create(params, callback);
  });
};
const GameLog = mongoose.model('GameLog', GameLogSchema);
const Game = mongoose.model('Game', GameSchema);
module.exports = Game;