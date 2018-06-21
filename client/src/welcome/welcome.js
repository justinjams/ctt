import React, { Component } from 'react';

import './styles/welcome.css';
import logo from '../img/logo.png';

import Login from './components/login';
import Register from './components/register';

class Welcome extends Component {
  render() {
    return (
      <div className='welcome-bg' style={{background: `url('${this.props.bgImage}')`}}>
        <div className="welcome-view">
          <h1>
            <img src={logo} alt='' />
          </h1>
          <div className="login-wrap">
            <Login onUser={this.props.onUser} />
            <Register onUser={this.props.onUser} />
          </div>
          <footer>
            <a href="#">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#">Rules</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#">Contact</a>
          </footer>
        </div>
      </div>
    );
  }
}

export default Welcome;
