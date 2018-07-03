import Card from '../../../components/card';
import assets from '../../../helpers/assets';

class GridCard extends Card {
  get block() {
    return this.props.game.grid[this.props.pos];
  }

  get cardBackImage() {
    if (this.block && this.props.game) {
      const profileIcon = this.props.game.profileIcons[this.block.hand];
      return assets.getProfileIcon(profileIcon);
    }
  }

  getHand() {
    if (this.block) {
      return this.block.hand;
    }
  }

  getFlipped() {
    if (this.block) {
      return this.block.flipped;
    }
  }

  getCard() {
    if (this.block) {
      return this.block.card;
    }
  }
}
export default GridCard;