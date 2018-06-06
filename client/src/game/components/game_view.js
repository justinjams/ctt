import React, { Component } from 'react';
import GridView from './grid_view';
import HandView from './hand_view';
import RulesView from './rules_view';

class GameView extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState(props.game);

    this.handleRestart = this.handleRestart.bind(this);
    this.onPlayHolding = this.onPlayHolding.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.toggleRulesClosed = this.toggleRulesClosed.bind(this);
  }

  render () {
    let body;
    if (this.state.rulesOpen) {
      body = (<RulesView game={this.state.game} handleRulesClosed={this.toggleRulesClosed} />);
    } else {
      body = (
        <div>
          <HandView game={this.state.game} hand={0} handleClick={this.selectCard} />
          <GridView game={this.state.game}
                    headline={this.state.headline}
                    holding={this.state.holding}
                    onPlayHolding={this.onPlayHolding} />
          <HandView game={this.state.game} hand={1} handleClick={this.selectCard} />
        </div>
      );
    }

    return (
      <div className={`game-view player-${this.state.game.turn}-turn`}>
        {body}
      </div>
    );
  }

  selectCard (pos, hand) {
    if (hand === this.state.game.turn) {
      const holding = { hand, pos };
      this.state.game.holding = holding;
      this.setState({ holding: holding });
    }
  }

  setGameOver (winner) {
    let winnerText = winner === 0 ? 'Victory' : winner === 1 ? 'Defeat' : 'Tie';

    this.setState({
      headline: {
        message: winnerText,
        color: `game-over ${winner}`
      }
    })
  }

  getInitialState (game) {
    return {
      game: game,
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

  onPlayHolding (game) {
    this.state.game.holding = false;
    this.setState({ game: game,
                    holding: false });
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
}
export default GameView;