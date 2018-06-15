import React, { Component } from 'react';

import './styles/lobby.css';

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
        <div className="button" role="button" onClick={this.handleCreateGame}>
          Create Game
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
    this.setState({ createGameOpen: false });
  }

  fetchLobbies () {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const params = {
      body: JSON.stringify(this.lobbyFilters),
      credentials: 'same-origin',
      headers: headers,
      method: 'GET'
    };
    fetch('/api/v1/games', params).then((response) => {
      response.json().then((body) => {
        this.setState({ games: body.games });
      });
    });
  }

}
export default Lobby;