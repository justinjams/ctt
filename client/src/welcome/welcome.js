import React, { Component } from 'react';

import './styles/welcome.css';

import LoginView from './components/login_view'
import RegisterView from './components/register_view'

class Welcome extends Component {
  render() {
    return (
      <div className="welcome-view">
        <h1>
          Champions<br />
          Triple&nbsp;Triad
        </h1>
        <RegisterView onUser={this.props.onUser}/>
        <LoginView onUser={this.props.onUser} />
      </div>
    );
  }
}

export default Welcome;
