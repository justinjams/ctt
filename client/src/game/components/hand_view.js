import React, { Component } from 'react';
import HandCardView from './hand_card_view';

class HandView extends Component {

  getSelected (pos) {
    if(this.props.game.holding &&
      this.props.game.holding.hand === this.props.hand &&
      this.props.game.holding.pos === pos) {
      return 'selected';
    } else return '';
  }

  renderClassName () {
    let classNames = [`hand-view ${this.props.hand}-hand`];

    // TODO: Change this to check for local player
    if (!this.props.game.isOpen() && this.props.hand !== 'player1') {
      classNames.push('closed');
    }

    return classNames.join(' ');
  }

  render () {
    return (
      <div className={this.renderClassName()}>
      {[0,1,2,3,4].map((pos)=>{
        return (
          <div className={`card-slider ${this.getSelected(pos)}`} key={pos}>
            <HandCardView game={this.props.game}
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