import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './styles/app.css';

import assets from './helpers/assets'

import Play from './play/play'
import Welcome from './welcome/welcome'

class App extends Component {
  constructor (props) {
    super(props);

    this.state = this.getInitialState();

    this.handleLogout = this.handleLogout.bind(this);
  }

  getInitialState () {
    return {
      bgImage: assets.getRandomSplash(),
      user: window.bootstrap.appState.user
    };
  }

  render () {
    if (this.state.user) {
      return (
        <Router>
          <div className="app">
            <header className="app-header">
              <Link to="/">
                <h1 className="app-title">Champions Triple Triad</h1>
              </Link>
              <ul className="app-nav">
                <li>
                  <Link to="/">Play</Link>
                </li>
                <li>
                  <Link to="/cards">Cards</Link>
                </li>
                <li>
                  <a href="/api/v1/users/logout" onClick={this.handleLogout}>Logout</a>
                </li>
              </ul>
            </header>
            <div className="app-body" style={{background: `url('${this.state.bgImage}') center 60px no-repeat`}}>
              <Route path="/" 
                     render={(props) => <Play {...props} user={this.state.user} />} />
              <Route path="/cards" 
                     render={(props) => <Play {...props} user={this.state.user} />} />
            </div>
          </div>
        </Router>
      );
    } else {
      return <Welcome />;
    }
  }

  handleLogout (e) {
    e.preventDefault();  
    fetch('/api/v1/users/logout', { credentials: 'same-origin' }).then(() => window.location = '/' );
  }

  handleUser (user) {
    this.setState({ user: user });
  }
}

export default App;
