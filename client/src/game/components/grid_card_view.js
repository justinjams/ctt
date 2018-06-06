import CardView from './card_view';
import assets from '../helpers/assets'

class GridCardView extends CardView {
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

  getCard() {
    const self = this.props.game.grid[this.props.pos];
    if (self) {
      return self.card;
    }
  }

  championImage () {
    const card = this.getCard();
    if (card) {
      return assets.getTile(card.key.toLowerCase());
    }
  }
}
export default GridCardView;