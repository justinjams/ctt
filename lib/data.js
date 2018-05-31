const RiotRequest = require('riot-lol-api');
const RIOT_API_KEY = 'RGAPI-990997ab-317c-43db-bf4e-d7dd74557eb8';
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
