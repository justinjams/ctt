import data from '../../data/data.json'
const DATA_KEYS = Object.keys(data.cards);

class AI {
  constructor (game) {
    this.game = game;
    this.type = 'ai';
    this.hand = [0,0,0,0,0].map(()=> DATA_KEYS[Math.floor(Math.random() * DATA_KEYS.length)]);
    this.score = 5;
  }

  play (view) {
    setTimeout(()=>{
      this.game.holding = { hand: 'player2', pos: Math.floor(Math.random()*this.hand.length) };
      view.setState({ holding: this.game.holding });

      setTimeout(()=>{
        while(!this.game.setCard(Math.floor(Math.random()*9), this.game.holding)) {};
        this.game.holding = null;
        view.setState({ holding: false });
      }, 250);
    }, 0);
  }
}
export default AI;