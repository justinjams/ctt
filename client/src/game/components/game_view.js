import React, { Component } from 'react';
import Game from '../game';
import GridCardView from './grid_card_view';
import HandView from './hand_view';
import RulesView from './rules_view';

class GameView extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState();

    this.toggleRulesClosed = this.toggleRulesClosed.bind(this);
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

    if (holding) {
      const couldPlayCard = this.state.game.setCard({
        card: this.state.game.players[holding.hand].hand[holding.pos],
        gridPos: pos,
        hand: holding.hand,
        handPos: holding.pos
      });

      if (couldPlayCard) {
        this.state.game.holding = false;
        this.setState({ holding: false });
      }
    }
  }

  setGameOver (winner) {
    let winnerText = winner === 'player1' ? 'Victory' : winner === 'player2' ? 'Defeat' : 'Tie';

    this.setState({
      headline: {
        message: winnerText,
        color: `game-over ${winner}`
      }
    })
  }

  getInitialState () {
    return {
      game: new Game(this),
      headline: {
        messasge: '',
        color: ''
      },
      holding: false,
      rulesOpen: false
    };
  }

  toggleRulesClosed () {
    this.setState({ rulesOpen: !this.state.rulesOpen });
    if(this.state.rulesOpen) this.handleRestart();
  }

  handleRestart () {
    this.setState(this.getInitialState());
  }

  setHeadline (message, color) {
    this.setState({
      headline: {
        message: message,
        color: color
      }
    });

    // setTimeout(()=>{
    //   this.setState({
    //     headline: {
    //       message: '',
    //       color: ''
    //     }
    //   });
    // }, 1000);
  }

  renderGridView () {
    return (
      <div className="grid-view">
        <div className="grid-row">
          <span className="player1 score">
            {this.state.game.players.player1.score}
          </span>
          <span className={`headline ${this.state.headline.color}`}>
            {this.state.headline.message}
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
        <div className="grid-row">
          <div className="restart button" role="button" onClick={this.handleRestart}>Restart</div>
          <div className="restart button" role="button" onClick={this.toggleRulesClosed}>Configure</div>
        </div>
      </div>
    );
  }

  render () {
    let body;
    if (this.state.rulesOpen) {
      body = (<RulesView game={this.state.game} handleRulesClosed={this.toggleRulesClosed} />);
    } else {
      body = (
        <div>
          <HandView game={this.state.game} hand={'player1'} handleClick={this.selectCard} />
          {this.renderGridView()}
          <HandView game={this.state.game} hand={'player2'} handleClick={this.selectCard} />
        </div>
      );
    }

    return (
      <div className={`game-view ${this.state.game.getCurrentTurn()}-turn`}>
        {body}
      </div>
    );
  }
}
export default GameView;