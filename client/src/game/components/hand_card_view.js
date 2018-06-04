import CardView from './card_view';
import assets from '../helpers/assets'

class HandCardView extends CardView {
  championImage () {
    const card = this.getCardName().toLowerCase();
    return assets.getTile(card);
  }

  getCardName () {
    return this.props.game.players[this.props.hand].hand[this.props.pos];
  }

  getHand() {
    return this.props.hand;
  }
}
export default HandCardView;