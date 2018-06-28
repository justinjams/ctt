import React, { Component } from 'react';
import GridCardView from './grid_card_view';

import api from '../../../helpers/api';

class GridView extends Component {
  constructor (props) {
    super(props);

    this.handleForfeit = this.handleForfeit.bind(this);
    this.handleSelectGrid = this.handleSelectGrid.bind(this);
  }

  render () {
    console.log(this.props.game.state);
    return (
      <div className="grid-view">
        <div className="grid-row">
          <span className="player-0 score">
            {this.props.game.scores[0].score}
          </span>
          <span className={`headline ${this.props.headline.color}`}>
            {this.props.headline.message}
          </span>
          <span className="player-1 score">
            {this.props.game.scores[1]}
          </span>
        </div>
        <div className="grid-row">
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={0} />
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={1} />
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={2} />
        </div>
        <div className="grid-row">
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={3} />
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={4} />
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={5} />
        </div>
        <div className="grid-row">
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={6} />
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={7} />
          <GridCardView game={this.props.game} handleClick={this.handleSelectGrid} pos={8} />
        </div>
        <div className="grid-row">
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
export default GridView;