import React, { Component } from 'react';
import HandCardView from './hand_card_view';

class HandView extends Component {

  getSelected (pos) {
    if(this.props.holding &&
      this.props.holding.hand === this.props.hand &&
      this.props.holding.pos === pos) {
      return 'selected';
    } else return '';
  }

  renderClassName () {
    let classNames = [`hand-view player-${this.props.hand}-hand`];
    if (!this.props.game.rules.OPEN &&
        this.props.game.players[this.props.hand].userId !== this.props.user.id) {
      classNames.push('closed');
    }

    return classNames.join(' ');
  }

  render () {
    return (
      <div className={this.renderClassName()}>
      {[0,1,2,3,4].map((pos)=>{
        let card = this.props.game.players[this.props.hand].hand[pos];

        return (
          <div className={`card-slider ${this.getSelected(pos)}`} key={pos}>
            <HandCardView card={card}
                          game={this.props.game}
                          hand={this.props.hand}
                          handleClick={this.props.handleClick}
                          pos={pos} />
          </div>
        );
      })}
      </div>
    );
  }
}
export default HandView;