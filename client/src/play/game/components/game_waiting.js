import React, { Component } from 'react';

class GameWaiting extends Component {
  constructor (props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel () {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const params = {
      credentials: 'same-origin',
      headers: headers,
      method: 'POST'
    }
    fetch(`/api/v1/games/${this.props.game.id}/forfeit`, params).then((response) => {
      return response.json();
    }).then((body) => {
      console.log(this.props);
      this.props.onGameReady();
    });
  }

  render () {
    return (
      <div className='game-waiting'>
         Waiting for other players...
         <div role='button' className="button" onClick={this.handleCancel}>
          Cancel Game
         </div>
      </div>
    );
  }
}
export default GameWaiting;