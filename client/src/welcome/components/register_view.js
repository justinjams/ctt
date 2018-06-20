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
          <label for="user[username]">Username</label>
          <input type="text" name="user[username]" value={this.state.values.username} onChange={this.createChangeHandler('username')} />
          <label for="user[email]">Email</label>
          <input type="email" name="user[email]" value={this.state.values.email} onChange={this.createChangeHandler('email')} />
          <label for="user[password]">Password</label>
          <input type="password" name="user[password]" value={this.state.values.password} onChange={this.createChangeHandler('password')} />
          <label for="user[passwordConf]">Confirm Password</label>
          <input type="passwordConf" name="user[passwordConf]" value={this.state.values.passwordConf} onChange={this.createChangeHandler('passwordConf')} />
          <input role="button" class="button" type='submit' value='REGISTER' />
        </form>
      </div>
    );
  }
}

export default RegisterView;
