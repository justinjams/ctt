import React, { Component } from 'react';

import api from '../../helpers/api';

class Login extends Component {
  constructor (props) {
    super(props);

    this.state = { values: {
      password: '',
      username: ''
    } };

    this.createChangeHandler = this.createChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createChangeHandler (key) {
    return (event) => {
      const values = this.state.values;
      this.setState({ values: Object.assign({}, values, { [key]: event.target.value }) });
    }
  }

  renderErrors () {
    if (this.state.errors) {
      return (
        <div className='errors'>
          {this.state.errors.join('\n')}
        </div>
      );
    }
  }

  render () {
    return (
      <div className='login-view'>
        {this.renderErrors()}
        <form action='/api/v1/sessions' onSubmit={this.handleSubmit} method='post'>
          <label htmlFor='username'>Username</label>
          <input autoComplete='username' type='text' name='username' value={this.state.values.username} onChange={this.createChangeHandler('username')} />
          <label htmlFor='password'>Password</label>
          <input autoComplete='current-password' type='password' name='password' value={this.state.values.password} onChange={this.createChangeHandler('password')} />
          <input className='button' type='submit' value='SIGN IN' />
        </form>
      </div>
    );
  }

  handleSubmit (e) {
    e.preventDefault();

    api.v1.sessions.create({ user: this.state.values }).then((body) => {
      this.setState({ errors: [] });
      if (body.error) {
        this.setState({ errors: [body.message] });
      } else if(body.user) {
        this.props.onUser(body.user);
      }
    });
  }
}

export default Login;
