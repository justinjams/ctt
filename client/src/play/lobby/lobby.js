import React, { Component } from 'react';

import './styles/lobby.css';

import api from '../../helpers/api';

import LobbyGame from './components/lobby_game';
import CreateGame from './components/create_game';

class Lobby extends Component {
  constructor (props) {
    super(props);

    this.state = {
      createGameOpen: false,
      games: [],
      lobbyFiltersState: 'created'
    };

    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.handleGameReady = this.handleGameReady.bind(this);
  }

  componentDidMount () {
    this.fetchLobbies();
  }

  render () {
    return (
      <div className='lobby-view'>
        <div className='lobby-games'>
          {this.state.games.map((game, i) =>
            <LobbyGame game={game} key={i} onGameReady={this.props.onGameReady} />
          )}
        </div>
        <div className='lobby-preview'>
        </div>
        <div className="button create-game-btn" role="button" onClick={this.handleCreateGame}>
          CREATE GAME
        </div>
        {this.state.createGameOpen ? <div className='popover-bg'></div> : ''}
        {this.renderCreateGame()}
      </div>
    );
  }

  renderCreateGame () {
    if (this.state.createGameOpen) {
      return <CreateGame onGameReady={this.handleGameReady} />
    }
  }

  handleCreateGame () {
    this.setState({ createGameOpen: true });
  }

  handleGameReady (game) {
    this.props.onGameReady(game);
  }

  fetchLobbies () {
    api.v1.games.index().then((body) => {
      this.setState({ games: body.games });
    });
  }

}
export default Lobby;