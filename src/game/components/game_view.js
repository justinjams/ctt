import React, { Component } from 'react';
import Game from '../game';
import GridCardView from './grid_card_view';
import HandCardView from './hand_card_view';

class GameView extends Component {
  constructor(props) {
    super(props);
    this.game = new Game();
    this.state = {
      holding: false
    };
    this.selectCard = this.selectCard.bind(this);
    this.selectGrid = this.selectGrid.bind(this);
    this.turn = 0;
  }

  selectCard(pos, hand) {
    if (this.turn % 2 == 0 && hand === 'hand' || this.turn % 2 && hand === 'enemy') {
      this.setState({ holding: { hand, pos } });
    }
  }

  selectGrid(pos) {
    const holding = this.state.holding;

    if (holding && this.game.setCard(pos, holding)) {
      this.setState({ holding: false });
      this.turn ++;
    }
  }
  // Card order: top, right, down, left
  // 0 1 2
  // 3 4 5
  // 6 7 8
  render() {
    return (
      <div className="game-view">
        <div className="hand-view player-1">
          <HandCardView game={this.game} hand={'hand'} handleClick={this.selectCard} pos={0} />
          <HandCardView game={this.game} hand={'hand'} handleClick={this.selectCard} pos={1} />
          <HandCardView game={this.game} hand={'hand'} handleClick={this.selectCard} pos={2} />
          <HandCardView game={this.game} hand={'hand'} handleClick={this.selectCard} pos={3} />
          <HandCardView game={this.game} hand={'hand'} handleClick={this.selectCard} pos={4} />
        </div>
        <div className="grid-view">
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
          <div className="grid-row">
          {(()=>{
            if(this.state.holding) {
              return (
                <HandCardView game={this.game} hand={this.state.holding.hand} handleClick={()=>{}} pos={this.state.holding.pos} />
              );
            }
          })()}
          </div>
        </div>
        <div className="hand-view player-2">
          <HandCardView game={this.game} hand={'enemy'} handleClick={this.selectCard} pos={0} />
          <HandCardView game={this.game} hand={'enemy'} handleClick={this.selectCard} pos={1} />
          <HandCardView game={this.game} hand={'enemy'} handleClick={this.selectCard} pos={2} />
          <HandCardView game={this.game} hand={'enemy'} handleClick={this.selectCard} pos={3} />
          <HandCardView game={this.game} hand={'enemy'} handleClick={this.selectCard} pos={4} />
        </div>
      </div>
    );
  }
}
export default GameView;