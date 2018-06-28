import React, { Component } from 'react';

import api from '../../../helpers/api';
import assets from '../../../helpers/assets';

class LobbyGame extends Component {
  constructor (props) {
    super(props);

    this.state = {};

    this.handleJoin = this.handleJoin.bind(this);
  }

  render () {
    return (
      <div className='lobby-game-view'>
        <img src={'x' || assets.getProfileIcon(1)} alt='' />
        <span>
          {this.props.game.userIds.length}/2 players
        </span>
        {this.renderButton()}
        <div>
          {Object.keys(this.props.game.rules).map((rule, i) => {
            let className = 'rule ';
            className += this.props.game.rules[rule] ? 'active' : '';
            return <span className={className} key={i}>{rule}</span>
          })}
        </div>
      </div>
    );
  }

  renderButton () {
    if (!this.props.onGameReady) {
      return;
    } else if (this.props.game.state === 'created') {
      return (
        <span className='join-btn button' onClick={this.handleJoin} role='button'>
          JOIN
        </span>
      );
    } else if (this.props.game.state === 'active') {
      return (
        <span className='spectate-btn button' role='button'>
          SPECTATE
        </span>
      );
    } else {
      return <span>FINISHED</span>
    }
  }

  handleJoin () {
    api.v1.games.join(this.props.game.id).then((body) => {
      this.props.onGameReady(body.game);
    });
  }
}
export default LobbyGame;