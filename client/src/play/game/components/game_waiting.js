import React, { Component } from 'react';

import api from '../../../helpers/api';
import CardView from './card_view';
import Lobby from '../../lobby/components/lobby_game';

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
        <div className='cards'>
        {[0,1,2,3,4].map((pos)=>{
          let card = this.props.game.hands[0][pos];

          return <CardView card={card}
                           game={this.props.game}
                           hand={0}
                           noBack={true}
                           key={pos}
                           pos={pos} />;
        })}
        </div>
        <Lobby game={this.props.game} />
        <div role='button' className="button" onClick={this.handleCancel}>
          CANCEL
        </div>
      </div>
    );
  }
}
export default GameWaiting;