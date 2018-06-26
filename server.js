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
app.use(bodyParser.urlencoded({ extended: true }));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
  cookie: { secure: false },
  resave: true,
  saveUninitialized: false,
  secret: 'i cant mid',
  store: new MongoStore({ mongooseConnection: db })
}));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

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

function loadAppState(req, res, next) {
  if (req.session.userId) {
    return User.findOne({ _id: req.session.userId }, (err, user) => {
      if (err) return res.json(err);
      res.locals.user = user
      Game.findOne({ state: ['created', 'active'], userIds: req.session.userId }, (err, game) => {
        if (err) return res.json(err);
        res.locals.game = game;
        next();
      });
    });
  }

  next();
}

// APP API
app.get('/api/v1/app/start', loadAppState, (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const randomCard = DATA_KEYS[parseInt(Math.random() * DATA_KEYS.length)].toLowerCase();
  const bootstrap = {
    appState: {},
    bgImage: `https://s3.amazonaws.com/champions-triple-triad/champion/splash/${randomCard}_0.jpg`
  };

  bootstrap.appState.user = res.locals.user ? res.locals.user.toAttributes() : null;
  bootstrap.appState.game = res.locals.game ? res.locals.game.toAttributes() : null;

  res.json(bootstrap);
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
    const gamesJson = {
      games: games.map((game) => game.toAttributes())
    };
    res.json(gamesJson);
  });
});

app.post('/api/v1/games/new', isAuthenticated, (req, res) => {
  Game.start({ userId: req.session.userId,
               rules: req.body.rules,
               solo: req.body.solo }, (err, game) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ game: game.toAttributes() });
  });
});

app.post('/api/v1/games/:gameId/play', isAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  Game.findOne({ _id: req.params.gameId }).exec((err, game) => {
    if (req.session.userId !== game.userIds[game.turn]) {
      return res.json({
        success: false,
        error: 'Invalid move'
      });
    }

    game.setCard(req.body, (err) => {
      const gameJson = game.toAttributes();
      const response = {
        game: gameJson,
        success: !err,
        error: err
      };
      if (!err) {
        io.emit(`games:play:${game.id}`, {
          game: gameJson
        });
      }
      res.json(response);
    });
  });
});

app.post('/api/v1/games/:gameId/join', isAuthenticated, (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec((err, game) => {
    Player.forUser(req.session.userId, (err, player) => {
      game.userIds.push(req.session.userId);
      game.players.push(player);
      if (game.players.length === 2) {
        game.state = 'active';
      }
      game.save((err) => {
        res.setHeader('Content-Type', 'application/json');
        res.json({ game: game.toAttributes() });
      });
    });
  });
});

app.post('/api/v1/games/:gameId/forfeit', isAuthenticated, (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec((err, game) => {
    if (0 > game.userIds.indexOf(req.session.userId)) {
      return res.json({
        error: 'Invalid request'
      });
    }
    game.state = 'finished';

    game.save((err) => {
      res.setHeader('Content-Type', 'application/json');
      const response = {
        game: game.toAttributes(),
      };
      if (err) {
        response.error = 'Unable to complete';
      } else {
        io.emit(`games:play:${game.id}`, {
          game: game.userIds.length > 1 ? game.toAttributes() : null
        });
      }
      res.json(response);
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
        req.session.userUsername = user.username;
        res.json({ user: user.toAttributes() });
      }
    });
  }
});

const USER_UPDATE_WHITELIST = [
  'hand',
  'profileIcon'
];
app.post('/api/v1/users/:userId', isAuthenticated, loadAppState, (req, res, next) => {
  for(const key in req.body) {
    if(USER_UPDATE_WHITELIST.indexOf(key) > -1) {
      res.locals.user[key] = req.body[key];
    }
  }
  res.locals.user.save((err) => {
    if (err) {
      return res.json({
        message: 'Unable to make requested changes.',
        error: 'Update failed'
      });
    }
    io.emit(`users:${res.locals.user.id}`, {
      user: res.locals.user.toAttributes()
    });
    res.json({ user: res.locals.user });
  });
});

// SESSIONS API
app.post('/api/v1/sessions/new', (req, res, next) => {
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
        req.session.userUsername = user.username;
        res.json({ user: user });
      }
    });
  } else {
    res.json({
      message: 'Missing username or password.',
      error: 'Authentication failed'
    });
  }
});

app.delete('/api/v1/sessions', isAuthenticated, (req, res, next) => {
  // delete session object
  req.session.destroy((err) => {
    if(err) return next(err);
    
    res.json({});
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
