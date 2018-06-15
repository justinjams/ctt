import React, { Component } from 'react';
import GridCardView from './grid_card_view';

class GridView extends Component {
  constructor (props) {
    super(props);

    this.handleForfeit = this.handleForfeit.bind(this);
    this.handleSelectGrid = this.handleSelectGrid.bind(this);
  }

  render () {
    return (
      <div className="grid-view">
        <div className="grid-row">
          <span className="player-0 score">
            {this.props.game.players[0].score}
          </span>
          <span className={`headline ${this.props.headline.color}`}>
            {this.props.headline.message}
          </span>
          <span className="player-1 score">
            {this.props.game.players[1].score}
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
          <div className="forfeit button" role="button" onClick={this.handleForfeit}>Forfeit</div>
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
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const params = {
        body: JSON.stringify(options),
        credentials: 'same-origin',
        headers: headers,
        method: 'POST'
      }
      fetch(`/api/v1/games/${this.props.game.id}/play`, params).then((response) => {
        return response.json();
      }).then((body) => {
        if (body.success) {
          this.props.onPlayHolding(body.game);
        }
      });
    }
  }

  handleForfeit () {
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
      this.props.onGameReady();
    });
  }
}
export default GridView;