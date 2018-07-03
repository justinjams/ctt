import React, { Component } from 'react';

import './styles/play.css';

import Game from './game/components/game';
import Lobby from './lobby/lobby';

class Play extends Component {
  render () {
    if (this.props.game) {
      return (
        <Game game={this.props.game}
              user={this.props.user}
              onGameReady={this.props.onGameReady} />
      );
    } else {
      return <Lobby onGameReady={this.props.onGameReady} />;
    }
  }

}

export default Play;
