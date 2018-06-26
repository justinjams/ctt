import React, { Component } from 'react';

import api from '../../helpers/api';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = { values: {
      email: '',
      password: '',
      passwordConf: '',
      username: ''
    } };

    this.createChangeHandler = this.createChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createChangeHandler(key) {
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

  render() {
    return (
      <div className='register-view'>
        {this.renderErrors()}
        <form action='/api/v1/users/new' onSubmit={this.handleSubmit} method='post'>
          <label htmlFor='user[username]'>Username</label>
          <input autoComplete='username' type='text' name='user[username]' value={this.state.values.username} onChange={this.createChangeHandler('username')} />
          <label htmlFor='user[email]'>Email</label>
          <input autoComplete='email' type='email' name='user[email]' value={this.state.values.email} onChange={this.createChangeHandler('email')} />
          <label htmlFor='user[password]'>Password</label>
          <input autoComplete='off' type='password' name='user[password]' value={this.state.values.password} onChange={this.createChangeHandler('password')} />
          <label htmlFor='user[passwordConf]'>Confirm Password</label>
          <input autoComplete='off' type='password' name='user[passwordConf]' value={this.state.values.passwordConf} onChange={this.createChangeHandler('passwordConf')} />
          <input className='button' type='submit' value='REGISTER' />
        </form>
      </div>
    );
  }

  handleSubmit (e) {
    e.preventDefault();

    api.v1.users.create({ user: this.state.values }).then((body) => {
      this.setState({ errors: [] });
      if (body.error) {
        this.setState({ errors: [body.message] });
      } else if(body.user) {
        this.props.onUser(body.user);
      }
    });
  }
}

export default Register;
