const RiotRequest = require('riot-lol-api');
const RIOT_API_KEY = 'RGAPI-bc68e791-5cf2-48d2-98fc-a351df433071';
const output = {};
const fs = require('fs');

const championsHandler = function(err, data) {
  console.log(data)
  output.cards = data.data;
  for (let key in output.cards) {
    output.cards[key].power = [4, 4, 2, 2];
  }
  fs.writeFileSync('./src/data.json', JSON.stringify(output));
};

const riotRequest = new RiotRequest(RIOT_API_KEY);
riotRequest.request('na1',
                    'champion',
                    '/lol/static-data/v3/champions',
                    championsHandler);
[
 'img/champion',
 '8.9.1/img'
].forEach((path) => {
  const IMG_ROOT = `./dragontail-8.9.1/${path}`;
  const { exec } = require('child_process');
  const IMG_DEST = `./src/dt/${path}`;
  const child = exec(`mkdir -p ${IMG_DEST} && cp -r ${IMG_ROOT}/* ${IMG_DEST}`, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });
});
