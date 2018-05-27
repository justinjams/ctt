import CardView from './card_view';

let context = require.context("../../tiles", true, /\.(jpg)$/);
const files={};
context.keys().forEach((filename)=>{
  files[filename.match(/\.\/([^_]+)_/)[1]] = context(filename);
});

class GridCardView extends CardView {
  getCardName () {
    const self = this.props.game.grid[this.props.pos];
    if (self) {
      return self.card;
    }
  }

  getHand() {
    const self = this.props.game.grid[this.props.pos];
    if (self) {
      return self.player;
    }
  }

  getFlipped() {
    const self = this.props.game.grid[this.props.pos];
    if (self) {
      return self.flipped;
    }
  }

  championImage () {
    const card = this.getCardName().toLowerCase();
    return files[card];
  }
}
export default GridCardView;