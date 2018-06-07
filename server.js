const PORT = process.env.PORT || 3002;

const express = require('express');
const app = express();
app.use(express.json());

const Game = require('./server/models/game');
const games = [];

app.get('/api/games/new', function (req, res) {
  const game = new Game({ id: games.length });
  games[game.id] = game;

  res.setHeader('Content-Type', 'application/json');
  res.send(game.toJson());
});

app.post('/api/games/:gameId/play', function (req, res) {
  const game = games[req.params.gameId];
  // TODO: Validate, pluck params, error messages
  const success = game.setCard(req.body);

  res.setHeader('Content-Type', 'application/json');
  const response = {
    game: game.toAttributes(),
    success: success
  };
  res.send(JSON.stringify(response));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
