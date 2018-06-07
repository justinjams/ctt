import React, { Component } from 'react';
import profileIcon from '../../dt/8.9.1/img/profileicon/501.png'

class CardView extends Component {
  handleClick() {
    this.props.handleClick(this.props.pos, this.props.hand)
  }

  getFlipped() {
    return '';
  }

  getCard() {
    return this.props.card;
  }

  renderCardBack() {
    return (
      <div className="side back">
        <img height={128} width={128} src={profileIcon} alt=""/>
      </div>
    );
  }

  render () {
    const card = this.getCard();
    if (!card) {
      const holdingClass = this.props.game.holding ? `holding ${this.props.game.holding.hand}` : '';
      return (<div className={`card-view ${holdingClass}`} onClick={this.handleClick.bind(this)} />);
    }

    return (
      <div className={`card-view player-${this.getHand()} ${this.getFlipped()}`}
           onClick={this.handleClick.bind(this)}
           role="button">
        <div className="side">
          <img height={128} width={128} src={this.championImage()} alt="" />
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
export default CardView;