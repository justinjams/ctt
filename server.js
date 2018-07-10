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
io.set('origins', 'http://localhost:* http://ctt.justinjams.com:*');

// APP DEPENDENCIES
const Game = require('./server/models/game');
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
      res.locals.user = user;
      Game.findOne({ state: ['created', 'active'], userIds: req.session.userId }, (err, game) => {
        if (err) return res.json(err);
        if (game) {
          res.locals.game = game;
          next();
        } else if(req.session.gameInviteId) {
          Game.findOne({ _id: req.session.gameInviteId }, (err, game) => {
            if (err) return res.json(err);
            res.locals.game = game;
            next();
          });
        } else {
          next();
        }
      });
    });
  } else {
    next();
  }
}

// APP API
app.get('/api/v1/app/start', loadAppState, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const randomCard = DATA_KEYS[parseInt(Math.random() * DATA_KEYS.length)].toLowerCase();
  const bootstrap = {
    appState: {},
    bgImage: `http://assets.justinjams.com/champion/splash/${randomCard}_0.jpg`
  };

  bootstrap.appState.user = res.locals.user ? res.locals.user.toAttributes() : null;
  bootstrap.appState.game = res.locals.game ? res.locals.game.toAttributes() : null;
  bootstrap.appState.gameInviteId = req.session.gameInviteId;

  res.json(bootstrap);
});

app.get('/g/:gameId', (req, res) => {
  Game.findOne({ _id: req.params.gameId }, (err, game) => {
    if (err) console.error(err);
    if (!err && game) {
      req.session.gameInviteId = game.id;
    }

    res.redirect('/');
  });
});

// GAMES API
app.get('/api/v1/games', isAuthenticated, (req, res) => {
  const params = {
    state: req.body.state
  };

  Game.find({ state: 'created' }).
       sort({ updatedAt: -1 }).
       exec((err, games) => {
    if (err) return res.json(err);
    const gamesJson = {
      games: games.map((game) => game.toAttributes())
    };
    res.json(gamesJson);
  });
});

app.post('/api/v1/games/new', isAuthenticated, (req, res) => {
  Game.start({ userId: req.session.userId,
               rules: req.body.rules,
               ai: parseInt(req.body.ai) }, (err, game) => {
    if (err) return res.json(err);
    game.log.push({ message: 'Game started. Good luck!' });
    game.logTurn();
    game.aiMove();
    game.save((err) => {
      if (err) return res.json(err);
      res.json({ game: game.toAttributes() });
    });
  });
});

app.post('/api/v1/games/:gameId/play', isAuthenticated, (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec((err, game) => {
    if (err) return res.json(err);
    if (req.session.userId !== game.userIds[game.turn]) {
      return res.json({
        success: false,
        error: 'Invalid move'
      });
    }
    const success = game.setCard(req.body) !== false;
    game.save((err) => {
      if (err) return res.json(err);
      let gameAttributes = game.toAttributes();
      const response = {
        game: gameAttributes,
        success: !!success,
        error: err
      };
      if (success) {
        io.emit(`games:play:${game.id}`, {
          game: gameAttributes
        });
      }
      res.json(response);
      setTimeout(() => {
        game.aiMove();
        game.save((err) => {
          gameAttributes = game.toAttributes();
          io.emit(`games:play:${game.id}`, {
            game: gameAttributes
          });
        });
      }, 1200);
    });
  });
});

app.post('/api/v1/games/:gameId/join', isAuthenticated, (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec((err, game) => {
    User.findOne({ _id: req.session.userId }).exec((err, user) => {
      if (game.userIds.length >= 2 || game.state !== 'created') return res.json({});
      game.userIds.push(req.session.userId);
      game.hands.push(user.hand.slice())
      game.usernames.push(user.username);
      game.profileIcons.push(user.profileIcon);
      if (game.userIds.length === 2) {
        game.state = 'active';
      }
      game.save((err) => {
        if (err) return res.json(err);
        delete req.session.gameInviteId;
        io.emit(`games:play:${game.id}`, {
          game: game.toAttributes()
        });
        res.json({ game: game.toAttributes() });
      });
    });
  });
});

app.post('/api/v1/games/:gameId/forfeit', isAuthenticated, (req, res) => {
  Game.findOne({ _id: req.params.gameId }).exec((err, game) => {
    const index = game.userIds.indexOf(req.session.userId);
    if (0 > index) {
      return res.json({
        error: 'Invalid request'
      });
    }

    if(game.state != 'finished') {
      game.log.push({ message: `Game over. :P${index}: forfeits!`});
    }
    game.state = 'finished';

    game.save((err) => {
      if (err) return res.json(err);
      else {
        const gameAttributes = game.toAttributes();
        io.emit(`games:play:${game.id}`, {
          game: game.userIds.length > 1 ? gameAttributes : null
        });
        const response = {
          game: gameAttributes,
        };
        res.json(response);
      }
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

app.delete('/api/v1/users/:userId/games/:gameId', isAuthenticated, (req, res, next) => {
  if (req.session.gameInviteId === req.params.gameId) {
    delete req.session.gameInviteId;
  }
  res.json({});
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
        res.json({ user: user.toAttributes() });
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
