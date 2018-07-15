import React, { Component } from 'react';
import GridCard from './grid_card';

import api from '../../../helpers/api';
import assets from '../../../helpers/assets';

class Grid extends Component {
  constructor (props) {
    super(props);

    const messages = [];

    this.state = {
      forfeitWarningOpen: false,
      loading: false,
      messages: messages,
      renderedMessage: []
    };

    this.handleForfeit = this.handleForfeit.bind(this);
    this.handleSelectGrid = this.handleSelectGrid.bind(this);
    this.handleForfeitCancel = this.handleForfeitCancel.bind(this);
  }

  get messages () {
    return this.props.game.log.slice().reverse().slice(0, 6).map((m, i) => {
      const message = m.message.split(':').map((w) => /^P\d$/.exec(w) ? <span className={`player-${w[1]} player`}>{this.props.game.usernames[w[1]]}</span> : w );
      return <div className='item' key={m._id || i}>{message}</div>;
    });
  }

  renderCard (i) {
    return (
      <div className='card-slider' key={i}>
        <div className='card-slot'></div>
        <GridCard game={this.props.game} handleClick={this.handleSelectGrid} pos={i} />
      </div>
    );
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
            <span className="username">{this.props.game.usernames[0]}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
          <div className="player-1">
            <span className="username">&nbsp;&nbsp;&nbsp;&nbsp;{this.props.game.usernames[1]}</span>
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
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
        </div>
        <div className="grid-row">
          {this.renderCard(3)}
          {this.renderCard(4)}
          {this.renderCard(5)}
        </div>
        <div className="grid-row">
          {this.renderCard(6)}
          {this.renderCard(7)}
          {this.renderCard(8)}
        </div>
        <div>
          <div className="forfeit button" role="button" onClick={this.handleForfeit}>{this.props.game.state === 'finished' ? 'LEAVE' : 'SURRENDER'}</div>
        </div>
        {this.state.forfeitWarningOpen ? <div className='popover-bg' onClick={this.handleForfeitCancel}></div> : ''}
        {this.renderForfeitWarning()}
      </div>
    );
  }

  handleForfeitCancel () {
    this.setState({ forfeitWarningOpen: false, loading: false });
  }

  renderForfeitWarning () {
    if (this.state.forfeitWarningOpen) {
      return (
          <div className='rules-view forfeit-warning'>
        <div className='header'>
          Surrender?
        </div>
        <div className='button'
             onClick={this.handleForfeit}
             role="button">YES</div>
        <div className='button'
             onClick={this.handleForfeitCancel}
             role="button">NO</div>
      </div>
      );
    }
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
      if (this.state.forfeitWarningOpen) {
        this.setState({ loading: true });
        api.v1.games.forfeit(this.props.game.id).then(this.handleForfeitCancel);
      } else {
        this.setState({ forfeitWarningOpen: true });
      }
    }
  }
}
export default Grid;