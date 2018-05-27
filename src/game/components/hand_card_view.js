import CardView from './card_view';

let context = require.context("../../tiles", true, /\.(jpg)$/);
const files={};
context.keys().forEach((filename)=>{
  files[filename.match(/\.\/([^_]+)_/)[1]] = context(filename);
});

class HandCardView extends CardView {
  championImage () {
    const card = this.getCardName().toLowerCase();
    return files[card];
  }

  getCardName () {
    return this.props.game[this.props.hand][this.props.pos];
  }

  getHand() {
    return this.props.hand;
  }

  getFlipped() {
    
  }
}
export default HandCardView;