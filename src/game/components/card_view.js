import React, { Component } from 'react';
import data from '../data.json'

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
      return (<div className="card-view" onClick={this.handleClick.bind(this)} />);
    }

    return (
      <div className={`card-view ${this.getHand()} ${this.getFlipped()}`} onClick={this.handleClick.bind(this)}>
        <div className="side">
          <img height={100} width={100} src={this.championImage()} alt="" />
          <div className="power-wrap">
            <div className="power">
              <div className="top">{card.power[0]}</div>
              <div className="left">{card.power[1]}</div>
              <div className="bottom">{card.power[2]}</div>
              <div className="right">{card.power[3]}</div>
            </div>
          </div>
        </div>
        <div className="side back"></div>
      </div>
    );
  }
}
export default CardView;