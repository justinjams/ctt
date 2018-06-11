import React, { Component } from 'react';

import GridView from './grid_view';
import HandView from './hand_view';
import MenuView from '../../menu/components/menu_view'

class GameView extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState(props.game);

    this.onGameReady = this.onGameReady.bind(this);
    this.onPlayHolding = this.onPlayHolding.bind(this);
    this.selectCard = this.selectCard.bind(this);
  }

  render () {
    if (this.state.game) {
      return (
        <div className={`game-view player-${this.state.game.turn}-turn`}>
          <div>
            <HandView game={this.state.game} hand={0} handleClick={this.selectCard} />
            <GridView game={this.state.game}
                      headline={this.state.headline}
                      holding={this.state.holding}
                      onPlayHolding={this.onPlayHolding} />
            <HandView game={this.state.game} hand={1} handleClick={this.selectCard} />
          </div>
        </div>
      );
    } else {
      return <MenuView onGameReady={this.onGameReady} />;
    }
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
      holding: false
    };
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

  onGameReady (game) {
    this.setState({ game: game });
  }
}
export default GameView;