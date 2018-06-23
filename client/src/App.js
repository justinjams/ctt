import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';

import './styles/app.css';
import logo from './img/logo.png';

import Footer from './footer';
import Play from './play/play';
import Welcome from './welcome/welcome';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      bgImage: this.props.bgImage,
      game: this.props.game,
      user: this.props.user
    };

    this.socket = io('http://localhost:3002');

    this.handleLogout = this.handleLogout.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.bindToGame = this.bindToGame.bind(this);
    this.handleGame = this.handleGame.bind(this);
  }

  componentDidMount () {
    this.bindToGame();
  }

  componentDidChange () {
    this.bindToGame();
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
                  <Link to='/'>Play</Link>
                </li>
                <li>
                  <Link to='/cards'>Cards</Link>
                </li>
                <li>
                  <a href='/api/v1/users/logout' onClick={this.handleLogout}>Logout</a>
                </li>
              </ul>
            </header>
            <div className='app-body' style={{background: `url('${this.state.bgImage}') center no-repeat`}}>
              <Route path='/' 
                     render={(props) => <Play {...props} game={this.state.game} user={this.state.user} onGameReady={this.handleGame} />} />
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

  handleLogout (e) {
    e.preventDefault();
    fetch('/api/v1/users/logout', { credentials: 'same-origin' }).then(() => window.location = '/' );
  }

  handleUser (user) {
    this.setState({ user: user });
  }

  handleGame (game) {
    this.setState({ game: game });
  }
}

export default App;
