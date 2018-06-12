import React, { Component } from 'react';

import './styles/play.css';

import GameView from './game/components/game_view'

class Play extends Component {
  render () {
    return (
      <GameView game={window.bootstrap.appState.game}
                user={this.props.user} />
    );
  }
}

export default Play;
