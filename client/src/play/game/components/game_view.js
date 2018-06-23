import React, { Component } from 'react';

import GridView from './grid_view';
import HandView from './hand_view';
import GameWaiting from './game_waiting';

class GameView extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState();

    this.onPlayHolding = this.onPlayHolding.bind(this);
    this.selectCard = this.selectCard.bind(this);
  }

  renderClassName () {
    const className = ['game-view', `player-${this.props.game.turn}-turn`];
    this.props.game.players.forEach((p, i) => {
      if (p.userId === this.props.user.id) {
        className.push(`player-${i}-playing`);
      }
    });

    return className.join(' ');
  }

  render () {
    if (this.props.game.state !== 'created') {
     return (
        <div className={this.renderClassName()}>
          <div>
            <HandView game={this.props.game}
                      hand={0}
                      handleClick={this.selectCard}
                      holding={this.state.holding}
                      user={this.props.user} />
            <GridView game={this.props.game}
                     headline={this.state.headline}
                     holding={this.state.holding}
                     onGameReady={this.props.onGameReady}
                     onPlayHolding={this.onPlayHolding} />
            <HandView game={this.props.game}
                      hand={1}
                      handleClick={this.selectCard}
                      holding={this.state.holding}
                      user={this.props.user} />
          </div>
        </div>
      );
    } else {
      return <GameWaiting game={this.props.game} onGameReady={this.props.onGameReady} />
    }
  }

  selectCard (pos, hand) {
    if (hand === this.props.game.turn &&
        this.props.user.id === this.props.game.players[this.props.game.turn].userId) {
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

  getInitialState () {
    return {
      headline: {
        messasge: '',
        color: ''
      },
      holding: false
    };
  }

  onPlayHolding (game) {
    this.setState({ holding: false });
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