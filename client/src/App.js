import React, { Component } from 'react';
import './styles/app.css';
import assets from './game/helpers/assets'
import GameView from './game/components/game_view'
import MenuView from './menu/components/menu_view'

class App extends Component {
   constructor (props) {
    super(props);

    this.state = {
      bgImage: assets.getRandomSplash(),
      gameId: null
    };

    this.onGameReady = this.onGameReady.bind(this);
  }

  renderBodyView () {
    if (this.state.game) {
      return <GameView game={this.state.game} />;
    } else {
      return <MenuView onGameReady={this.onGameReady} />;
    }
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">League of Legends: Triple Triad</h1>
        </header>
        <div className="app-bg" style={{background: `url('${this.state.bgImage}') center center no-repeat`}}>
        </div>
        {this.renderBodyView()}
      </div>
    );
  }

  onGameReady (game) {
    this.setState({ game: game });
  }
}

export default App;
