import CardView from './card_view';

class HandCardView extends CardView {
  getHand() {
    return this.props.hand;
  }
}
export default HandCardView;