import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
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
        <Router>
          <div className='app'>
            <header className='app-header'>
              <h1 className='app-title'>
                <Link to='/'>
                  <img src={logo} alt='' />
                </Link>
              </h1>
              <ul className='app-nav'>
                <li>
                  <Link className='button' to='/'>PLAY</Link>
                </li>
                <li>
                  <Link className={`button ${this.state.game ? 'disabled' : ''}`} to='/deck'>DECK</Link>
                </li>
                <li>
                  <input value={this.state.user.username + '    ▼'} className='user-menu button' type='button' onMouseDown={this.handleUserMenuMouseDown}></input>
                  <div className='menu'>
                    <ul>
                      <li>
                        <div role='button' onMouseDown={this.handleLogout}>Logout</div>
                      </li>
                    </ul>
                  </div>
                  <img className='profile-icon' src={assets.getProfileIcon(this.state.user.profileIcon)} alt='' />
                </li>
              </ul>
            </header>
            <div className='app-body' style={{background: `url('${this.state.bgImage}') center no-repeat`}}>
              <Route exact path='/' 
                     render={(props) => <Play {...props} game={this.state.game} user={this.state.user} onGameReady={this.handleGame} />} />
              <Route path='/deck' 
                     render={(props) => <Deck {...props} user={this.state.user} />} />
            </div>
            <Footer />
          </div>
        </Router>
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
   // this.setState({ userMenuOpen: !this.state.userMenuOpen});

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
    this.setState({ game: game });
  }
}

export default App;
