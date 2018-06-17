#!/usr/bin/env nodejs

const PORT = process.env.PORT || 3002;

// THIRD PARTY DEPENDENCIES
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to database');
});

const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
  cookie: { secure: false },
  resave: true,
  saveUninitialized: false,
  secret: 'i cant mid',
  store: new MongoStore({ mongooseConnection: db })
}));

// APP DEPENDENCIES
const Game = require('./server/models/game');
const Player = require('./server/models/player');
const User = require('./server/models/user');

const data = require('./server/data/data.json');
const DATA_KEYS = Object.keys(data.cards);

// APP API
app.get('/api/v1/app/start.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');

  const randomCard = DATA_KEYS[parseInt(Math.random() * DATA_KEYS.length)].toLowerCase();
  const bootstrap = {
    appState: {},
    bgImage: `https://s3.amazonaws.com/champions-triple-triad/champion/splash/${randomCard}_0.jpg`
  };
  if (req.session.userId) {
    bootstrap.appState.user = {
      id: req.session.userId
    };
    Game.findOne({ state: ['created', 'active'], userIds: req.session.userId }, (err, game) => {
      if (err) next(err);
      if (game) bootstrap.appState.game = game.toAttributes();
      res.send(`window.bootstrap = ${JSON.stringify(bootstrap)};`);
    });
  } else {
    res.send(`window.bootstrap = ${JSON.stringify(bootstrap)};`);
  }
});

// GAMES API
app.get('/api/v1/games', (req, res) => {
  const params = {
    state: req.body.state
  };

  Game.find({ state: 'created' }).
       sort({ updatedAt: -1 }).
       exec((err, games) => {
    res.setHeader('Content-Type', 'application/json');
    const gamesJson = JSON.stringify({
      games: games.map((game) => game.toAttributes())
    });
    res.send(gamesJson);
  });
});

app.post('/api/v1/games/new', (req, res) => {
  Game.start({ userId: req.session.userId,
               rules: req.body.rules,
               solo: req.body.solo }, (err, game) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ game: game.toAttributes() }));
  });
});

app.post('/api/v1/games/:gameId/play', (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec(function (err, game) {
    const success = game.setCard(req.body, (err) => {
      res.setHeader('Content-Type', 'application/json');
      const response = {
        game: game.toAttributes(),
        success: !err
      };
      res.send(JSON.stringify(response));
    });
  });
});

app.post('/api/v1/games/:gameId/join', (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec(function (err, game) {
    Player.forUser(req.session.userId, (err, player) => {
      game.userIds.push(req.session.userId);
      game.players.push(player);
      if (game.players.length === 2) {
        game.state = 'active';
      }
      game.save(() => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ game: game.toAttributes() }));
      });
    });
  });
});

app.post('/api/v1/games/:gameId/forfeit', (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec(function (err, game) {
    game.state = 'finished';
    game.save((err) => {
      res.setHeader('Content-Type', 'application/json');
      const response = {
        game: game.toAttributes(),
      };
      res.send(JSON.stringify(response));
    });
  });
});

// USERS API
app.post('/api/v1/users/new', (req, res, next) => {
  const userData = req.body.user;

  if (userData.email &&
      userData.username &&
      userData.password &&
      userData.passwordConf &&
      userData.password === userData.passwordConf) {

    const newUserData = {
      email: userData.email,
      username: userData.username,
      password: userData.password
    };

    User.create(newUserData, (err, user) => {
      if (err) return next(err);
      
      req.session.userId = user.id;
      res.redirect('/');
    });
  } else {
    console.error('Validation failed');
  }
});

app.post('/api/v1/users/login', (req, res, next) => {
  const userData = req.body.user;

  if (userData.username &&
      userData.password) {

    User.authenticate(userData, (err, user) => {
      if (err) return next(err);

      req.session.userId = user.id;
      res.redirect('/');
    });
  } else {
    console.error('Validation failed');
  }
});

app.get('/api/v1/users/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if(err)  return next(err);
      
      res.redirect('/');
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
