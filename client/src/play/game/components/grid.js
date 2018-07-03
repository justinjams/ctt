import React, { Component } from 'react';
import GridCard from './grid_card';

import api from '../../../helpers/api';
import assets from '../../../helpers/assets';

class Grid extends Component {
  constructor (props) {
    super(props);

    const messages = [];

    this.state = {
      messages: messages,
      renderedMessage: []
    };

    // setInterval(() => {
    //   const message = 'Test message! ' + Math.round(99*Math.random());
    //   messages.push({ text: message, id: Math.round(999999*Math.random()) });
    //   this.setState({ messages: messages });
    // }, 1000);

    this.handleForfeit = this.handleForfeit.bind(this);
    this.handleSelectGrid = this.handleSelectGrid.bind(this);
  }

  get messages () {
    return this.props.game.log.slice().reverse().slice(0, 5).map((m, i) => {
      const message = m.message.split(':').map((w) => /^P\d$/.exec(w) ? <span className={`player-${w[1]} player`}>{this.props.game.names[w[1]]}</span> : w );
      console.log(message);
      return <div className='item' key={m._id}>{message}</div>;
    });
  }

  render () {
    return (
      <div className="grid-view">
        <div className="scoreboard">
          <div className="player-0">
            <img src={assets.getProfileIcon(this.props.game.profileIcons[0])} alt='' height={80} width={80}/>
            <span className="score">
              {this.props.game.scores[0]}
            </span>
            <span className="username">{this.props.game.names[0]}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
          <div className="player-1">
            <span className="username">&nbsp;&nbsp;&nbsp;&nbsp;{this.props.game.names[1]}</span>
            <img src={assets.getProfileIcon(this.props.game.profileIcons[1])} alt='' height={80} width={80} />
            <span className="score">
              {this.props.game.scores[1]}
            </span>
          </div>
          <div className='log'>
            {this.messages}
          </div>
          <div className='vs'>vs</div>
        </div>
        <div className="grid-row">
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={0} />
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={1} />
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={2} />
        </div>
        <div className="grid-row">
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={3} />
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={4} />
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={5} />
        </div>
        <div className="grid-row">
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={6} />
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={7} />
          <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={8} />
        </div>
        <div>
          <div className="forfeit button" role="button" onClick={this.handleForfeit}>{this.props.game.state === 'finished' ? 'LEAVE' : 'FORFEIT'}</div>
        </div>
      </div>
    );
  }

  handleSelectGrid (pos) {
    const holding = this.props.holding;

    if (holding) {
      const options = {
        gridPos: pos,
        hand: holding.hand,
        handPos: holding.pos
      }

      api.v1.games.play(this.props.game.id, options).then((body) => {
        if (body.success) {
          this.props.onPlayHolding(body.game);
        }
      });
    }
  }

  handleForfeit () {
    if (this.props.game.state === 'finished') {
      this.props.onGameReady();      
    } else {
      api.v1.games.forfeit(this.props.game.id);
    }
  }
}
export default Grid;