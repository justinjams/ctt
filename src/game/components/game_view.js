import React, { Component } from 'react';
import Game from '../game';
import GridCardView from './grid_card_view';
import HandView from './hand_view';

class GameView extends Component {
  constructor (props) {
    super(props);
    this.game = new Game();
    this.state = {
      holding: false
    };
    this.selectCard = this.selectCard.bind(this);
    this.selectGrid = this.selectGrid.bind(this);
  }

  selectCard (pos, hand) {
    if ((this.game.turn % 2 === 0 && hand === 'player') || (this.game.turn % 2 && hand === 'enemy')) {
      const holding = { hand, pos };
      this.game.holding = holding;
      this.setState({ holding: holding });
    }
  }

  selectGrid (pos) {
    const holding = this.state.holding;

    if (holding && this.game.setCard(pos, holding)) {
      this.game.holding = false;
      this.setState({ holding: false });
    }
  }

  renderGameOver () {
    if (this.game.turn === 9) {
      let state;
      if (this.game.players.player.score > this.game.players.enemy.score) state = 'Victory'
      else if (this.game.players.player.score < this.game.players.enemy.score) state = 'Defeat'
      else state = 'Tie'
      return (<div className="game-over">{state}</div>);
    } else return null;
  }

  getCurrentTurn () {
    return ['player', 'enemy'][this.game.turn%2];
  }

  // Card order: top, right, down, left
  // 0 1 2
  // 3 4 5
  // 6 7 8
  render () {
    return (
      <div className={`game-view ${this.getCurrentTurn()}-turn`}>
        <HandView game={this.game} hand={'player'} handleClick={this.selectCard} />
        <div className="grid-view">
          <div className="grid-row">
            <span className="player score">
              {this.game.players.player.score}
            </span>
            <span className="enemy score">
              {this.game.players.enemy.score}
            </span>
          </div>
          <div className="grid-row">
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={0} />
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={1} />
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={2} />
          </div>
          <div className="grid-row">
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={3} />
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={4} />
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={5} />
          </div>
          <div className="grid-row">
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={6} />
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={7} />
            <GridCardView game={this.game} handleClick={this.selectGrid} pos={8} />
          </div>
        </div>
        <HandView game={this.game} hand={'enemy'} handleClick={this.selectCard} />
        {this.renderGameOver()}
      </div>
    );
  }
}
export default GameView;