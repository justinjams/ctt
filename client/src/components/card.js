import React, { Component } from 'react';
import assets from '../helpers/assets'

class Card extends Component {
  handleClick() {
    this.props.handleClick && this.props.handleClick(this.props.pos, this.props.hand)
  }

  getFlipped() {
    return '';
  }

  get card() {
    return this.props.card;
  }
  
  getHand() {
    return this.props.hand;
  }

  championImage () {
    if (this.card) {
      return assets.getTile(this.card.key.toLowerCase(), this.card.skinId);
    }
  }

  get cardBackImage() {
    if (this.props.game) {
      return assets.getProfileIcon(this.props.game.profileIcons[this.props.hand]);
    }
  }

  renderCardBack() {
    if (this.cardBackImage) {
      return (
        <div className="side-back">
          <img height={136} width={136} src={this.cardBackImage} alt="" />
        </div>
      );
    }
  }

  render () {
    const card = this.card;
    if (!card && this.props.game) {
      const holdingClass = this.props.game.holding ? `holding ${this.props.game.holding.hand}` : '';
      return (<div className={`card-view ${holdingClass}`} onClick={this.handleClick.bind(this)} />);
    }

    return (
      <div className={`card-view player-${this.getHand()} ${this.getFlipped()}`}
           onClick={this.handleClick.bind(this)}
           role="button">
        <div className="side">
          <img height={122} width={122} src={this.championImage()} alt="" />
          <div className='nameplate'>
            {card.name}
          </div>
          <div className="side-gradient"></div>
          <div className="power-wrap">
            <div className="power">
              <div className="top">{card.power[0] > 9 ? 'A' : card.power[0]}</div>
              <div className="right">{card.power[1] > 9 ? 'A' : card.power[1]}</div>
              <div className="bottom">{card.power[2] > 9 ? 'A' : card.power[2]}</div>
              <div className="left">{card.power[3] > 9 ? 'A' : card.power[3]}</div>
            </div>
          </div>
        </div>
        {this.renderCardBack()}
      </div>
    );
  }
}
export default Card;