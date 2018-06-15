import React, { Component } from 'react';

class RegisterView extends Component {
  constructor(props) {
    super(props);

    this.state = { values: {
      email: '',
      password: '',
      passwordConf: '',
      username: ''
    } };

    this.createChangeHandler = this.createChangeHandler.bind(this);
  }

  createChangeHandler(key) {
    return (event) => {
      const values = this.state.values;
      this.setState({ values: Object.assign({}, values, { [key]: event.target.value }) });
    }
  }

  render() {
    return (
      <div className='register-view'>
        <form action='/api/v1/users/new' method='post'>
          <label>
            Username
            <input name='user[username]' type='text' value={this.state.values.username} onChange={this.createChangeHandler('username')} />
          </label>
          <label>
            Email
            <input name='user[email]' type='email' value={this.state.values.email} onChange={this.createChangeHandler('email')} />
          </label>
          <label>
            Password
            <input name='user[password]' type='password' value={this.state.values.password} onChange={this.createChangeHandler('password')} />
          </label>
          <label>
            Confirm Password
            <input name='user[passwordConf]' type='password' value={this.state.values.passwordConf} onChange={this.createChangeHandler('passwordConf')} />
          </label>
          <input type='submit' value='register' />
        </form>
      </div>
    );
  }
}

export default RegisterView;
