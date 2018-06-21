import React, { Component } from 'react';

import GridView from './grid_view';
import HandView from './hand_view';
import GameWaiting from './game_waiting';

class GameView extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState(props.game);

    this.onPlayHolding = this.onPlayHolding.bind(this);
    this.selectCard = this.selectCard.bind(this);
  }

  renderClassName () {
    const className = ['game-view', `player-${this.state.game.turn}-turn`];
    this.state.game.players.forEach((p, i) => {
      if (p.userId === this.props.user.id) {
        className.push(`player-${i}-playing`);
      }
    });

    return className.join(' ');
  }

  render () {
    if (this.state.game.state !== 'created') {
     return (
        <div className={this.renderClassName()}>
          <div>
            <HandView game={this.state.game}
                      hand={0}
                      handleClick={this.selectCard}
                      holding={this.state.holding}
                      user={this.props.user} />
            <GridView game={this.state.game}
                     headline={this.state.headline}
                     holding={this.state.holding}
                     onGameReady={this.props.onGameReady}
                     onPlayHolding={this.onPlayHolding} />
            <HandView game={this.state.game}
                      hand={1}
                      handleClick={this.selectCard}
                      holding={this.state.holding}
                      user={this.props.user} />
          </div>
        </div>
      );
    } else {
      return <GameWaiting game={this.state.game} onGameReady={this.props.onGameReady} />
    }
  }

  selectCard (pos, hand) {
    if (hand === this.state.game.turn &&
        this.props.user.id === this.state.game.players[this.state.game.turn].userId) {
      const holding = { hand, pos };
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
      currentPlayerHand: game.players.map((p) => p.userId).indexOf(this.props.user.id)
    };
  }

  onPlayHolding (game) {
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