import React, { Component } from 'react';
import GridCardView from './grid_card_view';

class GridView extends Component {
  constructor (props) {
    super(props);

    this.selectGrid = this.selectGrid.bind(this);
    this.setCard = this.setCard.bind(this);
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
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={0} />
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={1} />
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={2} />
        </div>
        <div className="grid-row">
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={3} />
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={4} />
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={5} />
        </div>
        <div className="grid-row">
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={6} />
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={7} />
          <GridCardView game={this.props.game} handleClick={this.selectGrid} pos={8} />
        </div>
        <div className="grid-row">
          <div className="restart button" role="button" onClick={this.toggleRulesClosed}>Configure</div>
        </div>
      </div>
    );
  }

  setCard (options) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const params = {
      body: JSON.stringify(options),
      headers: headers,
      method: 'POST'
    }
    return fetch(`/api/v1/games/${this.props.game.id}/play`, params).then((response) => {
      return response.json();
    });
  }

  selectGrid (pos) {
    const holding = this.props.holding;

    if (holding) {
      this.setCard({
        gridPos: pos,
        hand: holding.hand,
        handPos: holding.pos
      }).then((body) => {
        if (body.success) {
          this.props.onPlayHolding(body.game);
        }
      });
    }
  }
}
export default GridView;