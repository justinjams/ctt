import React, { Component } from 'react';

import './styles/play.css';

import GameView from './game/components/game_view';
import Lobby from './lobby/lobby';

class Play extends Component {
  constructor (props) {
    super(props);

    this.state = {
      game: window.bootstrap.appState.game
    };

    this.onGameReady = this.onGameReady.bind(this);
  }

  render () {
    if (this.state.game) {
      return (
        <GameView game={this.state.game}
                  user={this.props.user}
                  onGameReady={this.onGameReady} />
      );
    } else {
      return <Lobby onGameReady={this.onGameReady} />; //<MenuView onGameReady={this.onGameReady} />;
    }
  }

  onGameReady (game) {
    this.setState({ game: game });
  }
}

export default Play;
