import React, { Component } from 'react';

import api from '../../../helpers/api';
import Lobby from '../../lobby/components/lobby_game';

class GameInvite extends Component {
  constructor (props) {
    super(props);

    this.state = { loading: false };

    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
  }

  handleAccept () {
    this.setState({ loading: true });
    api.v1.games.join(this.props.game.id).then((body) => {
      this.props.onGameReady(body.game);
      this.setState({ loading: false });
    });
  }

  handleDecline () {
    this.setState({ loading: true });
    api.v1.users.decline(this.props.user.id, this.props.game.id).then(() => {
      // TODO: Set this in client state instead of reloading the page
      window.location.href = '/';
      this.setState({ loading: false });
    });
  }

  render () {
    return (
      <div className='game-invite rules-view appears'>
        <h2 className='header'>Challenge</h2>
        <h3><b>{this.props.game.usernames[0]}</b> invited you to play!</h3>
        <Lobby game={this.props.game} />
        <div role='button' className={`button ${this.state.loading ? 'disabled loading' : ''}`} onClick={this.handleAccept}>
          ACCEPT
        </div>
        <div role='button' className={`button ${this.state.loading ? 'disabled loading' : ''}`} onClick={this.handleDecline}>
          DECLINE
        </div>
      </div>
    );
  }
}
export default GameInvite;