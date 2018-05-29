const RiotRequest = require('riot-lol-api');
const RIOT_API_KEY = 'RGAPI-65891239-8bea-4f9d-aa5b-27e8787fd5a1';
const output = {};
const fs = require('fs');

const championsHandler = function(err, data) {
  output.cards = data.data;
  for (let key in output.cards) {
    const card = output.cards[key];
    card.power = [card.info.difficulty, card.info.attack, card.info.defense, card.info.magic];
  }
  fs.writeFileSync('./src/data/data.json', JSON.stringify(output));
};

const riotRequest = new RiotRequest(RIOT_API_KEY);
riotRequest.request('na1',
                    'champion',
                    '/lol/static-data/v3/champions?champListData=info',
                    championsHandler);
