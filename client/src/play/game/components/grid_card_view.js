import CardView from './card_view';

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
}
export default GridCardView;