import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './styles/app.css';

import Play from './play/play'

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {};

    this.handleLogout = this.handleLogout.bind(this);
  }

  render () {
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
                   render={(props) => <Play {...props} game={this.state.game} user={this.state.user} />} />
            <Route path="/cards" 
                   render={(props) => <Play {...props} game={this.state.game} user={this.state.user} />} />
          </div>
        </div>
      </Router>
    );
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
