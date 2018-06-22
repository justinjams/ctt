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

// middlewares

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else if(req.xhr) {
    res.status(403);
    res.json({
      message: 'Please log in to continue',
      error: 'Authentication required'
    });
  } else if(req.path !== '/') {
    res.redirect('/');
  }
}

// APP API
app.get('/api/v1/app/start', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

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
      res.send(JSON.stringify(bootstrap));
    });
  } else {
    res.send(JSON.stringify(bootstrap));
  }
});

// GAMES API
app.get('/api/v1/games', isAuthenticated, (req, res) => {
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

app.post('/api/v1/games/new', isAuthenticated, (req, res) => {
  Game.start({ userId: req.session.userId,
               rules: req.body.rules,
               solo: req.body.solo }, (err, game) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ game: game.toAttributes() }));
  });
});

app.post('/api/v1/games/:gameId/play', isAuthenticated, (req, res) => {
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

app.post('/api/v1/games/:gameId/join', isAuthenticated, (req, res) => {
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

app.post('/api/v1/games/:gameId/forfeit', isAuthenticated, (req, res) => {
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

  if (userData.password !== userData.passwordConf) {
    res.json({
      message: 'Please confirm your password.',
      error: 'Registration failed'
    });
  } else if (!userData.email ||
             !userData.username ||
             !userData.password ||
             !userData.passwordConf) {
    res.json({
      message: 'Please fill out the entire form.',
      error: 'Registration failed'
    });
  } else {
    const newUserData = {
      email: userData.email,
      username: userData.username,
      password: userData.password
    };

    User.create(newUserData, (err, user) => {
      if (err) {
        message = err.errors ? err.errors[Object.keys(err.errors)[0]].message : err.message;
        res.json({
          message: message,
          error: 'Registration failed'
        });
      } else {
        req.session.userId = user.id;
        res.json({ user: user });
      }
    });
  }
});

app.post('/api/v1/users/login', (req, res, next) => {
  const userData = req.body.user;

  if (userData.username &&
      userData.password) {

    User.authenticate(userData, (err, user) => {
      if (err)  {
        res.json({
          message: 'Invalid username or password.',
          error: 'Authentication failed'
        });
      } else {
        req.session.userId = user.id;
        res.redirect('/');
      }
    });
  } else {
    res.json({
      message: 'Missing username or password.',
      error: 'Authentication failed'
    });
  }
});

app.get('/api/v1/users/logout', isAuthenticated, (req, res, next) => {
  // delete session object
  req.session.destroy((err) => {
    if(err)  return next(err);
    
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
