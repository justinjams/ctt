import React, { Component } from 'react';

class MenuView extends Component {
  constructor (props) {
    super(props);

    this.startSinglePlayer = this.startSinglePlayer.bind(this);
  }

  render () {
    return (
      <div onClick={this.startSinglePlayer}>
        Start Game
      </div>
    );
  }

  startSinglePlayer () {
    fetch('/api/games/new').then((response) => {
      response.json().then((body) => {
        this.props.onGameReady(body);
      });
    });
  }
}
export default MenuView;