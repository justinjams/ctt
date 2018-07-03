import React, { Component } from 'react';
import Card from '../../../components/card';

class Hand extends Component {

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
        this.props.game.userIds[this.props.hand] !== this.props.user.id) {
      classNames.push('closed');
    }

    return classNames.join(' ');
  }

  render () {
    return (
      <div className={this.renderClassName()}>
      {[0,1,2,3,4].map((pos)=>{
        let card = this.props.game.hands[this.props.hand][pos];

        return (
          <div className={`card-slider ${this.getSelected(pos)}`} key={pos}>
            <Card card={card}
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
export default Hand;