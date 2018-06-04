import CardView from './card_view';
import assets from '../helpers/assets'

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
      return self.hand;
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
    return assets.getTile(card);
  }
}
export default GridCardView;