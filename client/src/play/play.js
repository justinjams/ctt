import React, { Component } from 'react';

import './styles/play.css';

import Game from './game/game';
import GameInvite from './game/components/game_invite';
import Lobby from './lobby/lobby';

class Play extends Component {
  render () {
    if(this.props.game &&
       this.props.gameInviteId &&
       this.props.gameInviteId === this.props.game.id) {
      return (
        <GameInvite game={this.props.game}
                    user={this.props.user}
                    onGameReady={this.props.onGameReady} />
      );
    } else if (this.props.game) {
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
