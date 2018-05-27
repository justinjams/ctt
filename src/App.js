import React, { Component } from 'react';
import logo from './logo.svg';
import './app.css';
import data from './game/data.json'
import GameView from './game/components/game_view'

let context = require.context("./splash", true, /\.(jpg)$/);
const bgs=[];
context.keys().forEach((filename)=>{
  bgs.push(context(filename));
});


class App extends Component {
   constructor(props) {
    super(props);
    this.state = {
      bgImage: bgs[Math.floor(Math.random() * bgs.length)]
    };
  }

  render() {
    return (
      <div className="App">
        <div className="app-bg" style={{background: `url('${this.state.bgImage}') center center no-repeat`}}>
        </div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">League of Legends: Triple Triad</h1>
        </header>
        <GameView />
      </div>
    );
  }
}

export default App;
