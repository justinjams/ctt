import React, { Component } from 'react';

import './styles/play.css';

import GameView from './game/components/game_view';
import Lobby from './lobby/lobby';

class Play extends Component {
  render () {
    if (this.props.game) {
      return (
        <GameView game={this.props.game}
                  user={this.props.user}
                  onGameReady={this.props.onGameReady} />
      );
    } else {
      return <Lobby onGameReady={this.props.onGameReady} />; //<MenuView onGameReady={this.onGameReady} />;
    }
  }

}

export default Play;
