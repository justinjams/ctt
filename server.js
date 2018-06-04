const express = require('express');
const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3002;

app.get('/api/test', function (req, res) {
  res.send('hello world');
});

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});