import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import io from 'socket.io-client';

import './styles/app.css';
import logo from './img/logo.png';
import api from './helpers/api';

import assets from './helpers/assets'

import Deck from './deck/deck';
import Footer from './footer';
import Play from './play/play';
import Welcome from './welcome/welcome';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      bgImage: this.props.bgImage,
      game: this.props.game,
      gameInviteId: this.props.gameInviteId,
      user: this.props.user,
      userMenuOpen: false
    };

    this.socket = io(`${window.location.hostname}:3002`);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.bindToGame = this.bindToGame.bind(this);
    this.bindToGame = this.bindToGame.bind(this);
    this.handleGame = this.handleGame.bind(this);
    this.handleUserMenuMouseDown = this.handleUserMenuMouseDown.bind(this);

    this.props.history.listen((location, action) => {
      this.setState({});
    });
  }

  componentDidMount () {
    this.bindToGame();
    this.bindToUser();
  }

  componentDidUpdate () {
    this.bindToGame();
    this.bindToUser();
  }

  render () {
    if (this.state.user) {
      return (
        <div className='app' ref={e => this.ref = e}>
          <header className='app-header'>
            <h1 className='app-title'>
              <Link to='/'>
                <img src={logo} alt='' />
              </Link>
            </h1>
            <ul className='app-nav'>
              <li>
                <Link className={`button ${window.location.pathname === '/' ? 'disabled' : '' }`} to='/'>PLAY</Link>
              </li>
              <li>
                <Link className={`button ${this.state.game || window.location.pathname === '/deck' ? 'disabled' : ''}`} to='/deck'>DECK</Link>
              </li>
              <li>
                <div className='user-menu-btn-display button' role='button' onMouseDown={this.handleUserMenuMouseDown}>
                  {this.state.user.username}
                  <img className='profile-icon'
                       role='button'
                       src={assets.getProfileIcon(this.state.user.profileIcon)} alt='' />
                </div>
                <div className='menu'>
                  <ul>
                    <li>
                      <div role='button' onMouseDown={this.handleLogout}>Logout</div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </header>
          <div className='app-body'>
            <Route exact path='/' 
                   render={(props) => <Play {...props} game={this.state.game} user={this.state.user} gameInviteId={this.state.gameInviteId} onGameReady={this.handleGame} />} />
            <Route path='/deck' 
                   render={(props) => <Deck {...props} user={this.state.user} />} />
          </div>
          <Footer />
          <div className='app-bg' style={{background: `url('${this.state.bgImage}') 0px 60px no-repeat`}} ></div>
        </div>
      );
    } else {
      return <Welcome bgImage={this.state.bgImage} onUser={this.handleUser} />;
    }
  }

  bindToGame () {
    if (this.state.game) {
      const gameChannel = `games:play:${this.state.game.id}`;

      if (this.state.lastGameChannel !== gameChannel) {
        if (this.state.lastGameChannel) {
          this.socket.off(this.state.lastGameChannel);
        }
        this.socket.on(gameChannel, (payload) => {
          this.setState({
            game: payload.game,
            lastGameChannel: gameChannel
          });
        });
      }
    }
  }

  bindToUser () {
    if (this.state.user) {
      const userChannel = `users:${this.state.user.id}`;

      if (this.state.lastUserChannel !== userChannel) {
        if (this.state.lastUserChannel) {
          this.socket.off(this.state.lastUserChannel);
        }
        this.socket.on(userChannel, (payload) => {
          this.setState({
            user: payload.user,
            lastUserChannel: userChannel
          });
        });
      }
    }
  }

  handleUserMenuMouseDown (e) {
    if (document.activeElement === e.target) {
       e.target.blur();
       e.preventDefault();
    }
  }

  handleLogout (e) {
    e.preventDefault();
    api.v1.sessions.delete().then(() => window.location = '/');
  }

  handleUser (user) {
    this.setState({ user: user });
  }

  handleGame (game) {
    this.setState({ game: game, gameInviteId: null });
  }
}

export default withRouter(App);
