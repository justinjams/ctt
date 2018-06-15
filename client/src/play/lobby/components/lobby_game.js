import React, { Component } from 'react';

class LobbyGame extends Component {
  constructor (props) {
    super(props);

    this.state = {};

    this.handleJoin = this.handleJoin.bind(this);
  }

  render () {
    return (
      <div className='lobby-game-view'>
        <span>
          {this.props.game.players.length}/2 players
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
    let type = '';
    if (this.props.game.state === 'created') {
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
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const params = {
      body: JSON.stringify(this.lobbyFilters),
      credentials: 'same-origin',
      headers: headers,
      method: 'POST'
    };
    fetch(`/api/v1/games/${this.props.game.id}/join`, params).then((response) => {
      response.json().then((body) => {
        this.props.onGameReady(body.game);
      });
    });
  }
}
export default LobbyGame;