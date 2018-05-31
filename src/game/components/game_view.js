import React, { Component } from 'react';
import Game from '../game';
import GridCardView from './grid_card_view';
import HandView from './hand_view';

class GameView extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState();

    this.handleRestart = this.handleRestart.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.selectGrid = this.selectGrid.bind(this);
  }

  selectCard (pos, hand) {
    if (hand === this.state.game.getCurrentTurn()) {
      const holding = { hand, pos };
      this.state.game.holding = holding;
      this.setState({ holding: holding });
    }
  }

  selectGrid (pos) {
    const holding = this.state.holding;

    if (holding && this.state.game.setCard(pos, holding, this)) {
      this.state.game.holding = false;
      this.setState({ holding: false });
    }
  }

  renderGameOver () {
    if (this.state.game.isGameOver()) {
      let state;
      if (this.state.game.players.player1.score > this.state.game.players.player2.score) state = 'Victory'
      else if (this.state.game.players.player1.score < this.state.game.players.player2.score) state = 'Defeat'
      else state = 'Tie'
      return (
        <div className="game-over">
          <div className={state.toLowerCase()}>{state}</div>
          <div className="restart" onClick={this.handleRestart}>Play Again</div>
        </div>
      );
    } else return null;
  }

  getInitialState () {
    return {
      holding: false,
      game: new Game(this)
    };
  }

  handleRestart () {
    this.setState(this.getInitialState());
  }

  render () {
    return (
      <div className={`game-view ${this.state.game.getCurrentTurn()}-turn`}>
        <HandView game={this.state.game} hand={'player1'} handleClick={this.selectCard} />
        <div className="grid-view">
          <div className="grid-row">
            <span className="player1 score">
              {this.state.game.players.player1.score}
            </span>
            <span className="player2 score">
              {this.state.game.players.player2.score}
            </span>
          </div>
          <div className="grid-row">
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={0} />
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={1} />
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={2} />
          </div>
          <div className="grid-row">
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={3} />
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={4} />
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={5} />
          </div>
          <div className="grid-row">
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={6} />
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={7} />
            <GridCardView game={this.state.game} handleClick={this.selectGrid} pos={8} />
          </div>
        </div>
        <HandView game={this.state.game} hand={'player2'} handleClick={this.selectCard} />
        {this.renderGameOver()}
      </div>
    );
  }
}
export default GameView;