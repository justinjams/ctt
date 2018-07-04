import React, { Component } from 'react';

import Grid from './grid';
import Hand from './hand';
import GameWaiting from './game_waiting';

class Game extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState();

    this.onPlayHolding = this.onPlayHolding.bind(this);
    this.selectCard = this.selectCard.bind(this);
  }

  renderClassName () {
    const className = ['game-view', `player-${this.props.game.turn}-turn`];
    this.props.game.userIds.forEach((userId, i) => {
      if (userId === this.props.user.id) {
        className.push(`player-${i}-playing`);
      }
    });

    return className.join(' ');
  }

  render () {
    if (this.props.game.state !== 'created') {
      let fireworks;
      if (this.props.game.state === 'finished') {
        fireworks = (
          <div className={`pyro player-${this.props.game.winner}`}>
            <div className="before"></div>
            <div className="after"></div>
          </div>
        );
      }
      return (
        <div className={this.renderClassName()}>
          {fireworks}
          <div>
            <Hand game={this.props.game}
                  hand={0}
                  handleClick={this.selectCard}
                  holding={this.state.holding}
                  user={this.props.user} />
            <Grid game={this.props.game}
                  headline={this.state.headline}
                  holding={this.state.holding}
                  onGameReady={this.props.onGameReady}
                  onPlayHolding={this.onPlayHolding} />
            <Hand game={this.props.game}
                  hand={1}
                  handleClick={this.selectCard}
                  holding={this.state.holding}
                  user={this.props.user} />
          </div>
        </div>
      );
    } else {
      return <GameWaiting game={this.props.game} onGameReady={this.props.onGameReady} />
    }
  }

  selectCard (pos, hand) {
    if (hand === this.props.game.turn &&
        this.props.user.id === this.props.game.userIds[this.props.game.turn]) {
      const holding = { hand, pos };
      this.setState({ holding: holding });
    }
  }

  getInitialState () {
    return {
      holding: false
    };
  }

  onPlayHolding (game) {
    this.setState({ holding: false });
  }
}
export default Game;