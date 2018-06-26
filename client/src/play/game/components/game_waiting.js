import React, { Component } from 'react';

import api from '../../../helpers/api';

class GameWaiting extends Component {
  constructor (props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel () {
    api.v1.games.forfeit(this.props.game.id);
  }

  render () {
    return (
      <div className='game-waiting'>
         Waiting for other players...
         <div role='button' className="button" onClick={this.handleCancel}>
          CANCEL
         </div>
      </div>
    );
  }
}
export default GameWaiting;