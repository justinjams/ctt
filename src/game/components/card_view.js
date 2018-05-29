import React, { Component } from 'react';
import data from '../../data/data.json'
import assets from '../helpers/assets'

class CardView extends Component {
  constructor(props) {
    super(props);

    this.getCard = this.getCard.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.props.pos, this.props.hand)
  }

  getCard() {
    return data.cards[this.getCardName()];
  }

  render () {
    const card = this.getCard();
    if (!card) {
      const holdingClass = this.props.game.holding ? `holding ${this.props.game.holding.hand}` : '';
      return (<div className={`card-view ${holdingClass}`} onClick={this.handleClick.bind(this)} />);
    }

    return (
      <div className={`card-view ${this.getHand()} ${this.getFlipped()}`} onClick={this.handleClick.bind(this)}>
        <div className="side">
          <img height={128} width={128} src={this.championImage()} alt="" />
          <div className="power-wrap">
            <div className="power">
              <div className="top">{card.power[0] > 9 ? 'A' : card.power[0]}</div>
              <div className="left">{card.power[1] > 9 ? 'A' : card.power[1]}</div>
              <div className="bottom">{card.power[2] > 9 ? 'A' : card.power[2]}</div>
              <div className="right">{card.power[3] > 9 ? 'A' : card.power[3]}</div>
            </div>
          </div>
        </div>
        <div className="side back">
        <img height={128} width={128} src={assets.getCardBack()} alt=""/>
        </div>
      </div>
    );
  }
}
export default CardView;