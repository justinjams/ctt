import CardView from './card_view';
import assets from '../helpers/assets'

class HandCardView extends CardView {
  championImage () {
    const card = this.props.card.key.toLowerCase();
    return assets.getTile(card);
  }

  getHand() {
    return this.props.hand;
  }
}
export default HandCardView;