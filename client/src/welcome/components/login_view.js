import React, { Component } from 'react';

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = { values: {
      password: '',
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
      <div className="login-view">
        <form action="/api/v1/users/login" method="post">
          <label for="user[username]">Username</label>
          <input type="text" name="user[username]" value={this.state.values.username} onChange={this.createChangeHandler('username')} />
          <label for="user[password]">Password</label>
          <input type="password" name="user[password]" value={this.state.values.password} onChange={this.createChangeHandler('password')} />
          <input class="button" role="button" type="submit" value="SIGN IN" />
        </form>
      </div>
    );
  }
}

export default LoginView;
