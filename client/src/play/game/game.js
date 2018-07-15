import React, { Component } from 'react';

import Grid from './components/grid';
import Hand from './components/hand';
import GameWaiting from './components/game_waiting';

class Game extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState();

    this.onPlayHolding = this.onPlayHolding.bind(this);
    this.selectCard = this.selectCard.bind(this);
  }

  selectCard (pos, hand) {
    if (hand === this.props.game.turn &&
        this.props.user.id === this.props.game.userIds[this.props.game.turn]) {
      const holding = { hand, pos };
      this.setState({ holding: holding });
    }
  }

  getInitialState () {
    return { holding: false };
  }

  onPlayHolding (game) {
    this.setState({ holding: false });
  }

  renderClassName () {
    const className = ['game-view appears',
                       `player-${this.props.game.turn}-turn`,
                       this.state.holding ? 'holding' : ''];
    if (this.props.game.userIds[this.props.game.turn] === this.props.user.id &&
        this.props.game.state === 'active') {
      className.push(`player-${this.props.game.turn}-playing`);
    }

    return className.join(' ');
  }

  render () {
    if (this.props.game.state !== 'created') {
      
      return (
        <div className={this.renderClassName()}>
          {this.renderFireworks()}
          <div>
            <Hand game={this.props.game}
                  hand={0}
                  handleClick={this.selectCard}
                  holding={this.state.holding}
                  user={this.props.user} />
            <Grid game={this.props.game}
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

  renderFireworks () {
    if (this.props.game.state === 'finished') {
      return (
        <div className={`pyro player-${this.props.game.winner}`}>
          <div className="before"></div>
          <div className="after"></div>
        </div>
      );
    }
  }
}
export default Game;