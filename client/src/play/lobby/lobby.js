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
      <div className='lobby-view appears'>
        <div className='header'>
          Find Games
        </div>
        <div className='lobby-games'>
          {this.renderLobbies()}
        </div>
        <div className='lobby-preview'>
        </div>
        <div className="button create-game-btn" role="button" onClick={this.handleCreateGame}>
          CREATE GAME
        </div>
        {this.state.createGameOpen ? <div className='popover-bg' onClick={()=>this.setState({ createGameOpen: false })}></div> : ''}
        {this.renderCreateGame()}
      </div>
    );
  }

  renderCreateGame () {
    if (this.state.createGameOpen) {
      return <CreateGame onGameReady={this.handleGameReady} />
    }
  }

  renderLobbies() {
    if (this.state.games.length > 0) {
      return this.state.games.map((game, i) =>
        <LobbyGame game={game} key={i} onGameReady={this.props.onGameReady} />
      );
    } else return <div className='no-games'>No games available.<br />Create one to do battle with players or against a bot!</div>;
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