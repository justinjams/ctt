import React, { Component } from 'react';

import api from '../../../helpers/api';

class CreateGame extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ai: 0,
      loading: false,
      rules: {
        OPEN: true,
        SAME: false,
        PLUS: false
      } };

    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.createOpponentHandler = this.createOpponentHandler.bind(this);
  }

  createRulesHandler (prop) {
    return (e) => {
      const newRules = Object.assign(this.state.rules, { [prop]: !this.state.rules[prop] });
      this.setState({ rules: newRules });
    }
  }

  createOpponentHandler (type) {
    return () => {
      this.setState({ ai: type });
    };
  }

  render () {
    return (
      <div className='create-game-view rules-view appears-up'>
        <div className='header'>
          Game Settings
        </div>
        <div className='opponent'>
          <h3>Opponent</h3>
          <ul>
            <li>
              <div className={`button ${this.state.ai === 0 ? 'active' : ''}`} onClick={this.createOpponentHandler(0)} role='button'>Player</div>
            </li>
            <li>
              <div className={`button ${this.state.ai === 1 ? 'active' : ''}`} onClick={this.createOpponentHandler(1)} role='button'>Aldous (Easy)</div>
            </li>
            <li>
              <div className={`button ${this.state.ai === 2 ? 'active' : ''}`} onClick={this.createOpponentHandler(2)} role='button'>Bart (Medium)</div>
            </li>
          </ul>
        </div>
        <div className='rules'>
          <h3>Rules</h3>
          <ul>
            {['OPEN', 'SAME', 'PLUS'].map((rule, i)=>{
              return (
                <li key={i}>
                  <div className='rule'>
                    <div className={`button ${this.state.rules[rule] ? 'active' : ''}`} onClick={this.createRulesHandler(rule)} role='button'>
                      {rule.replace(/^(.)(.*)$/, (e, l, r) => l + r.toLowerCase() )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <a className="rules-link" href="http://ffxivtriad.com/rules" rel="noopener noreferrer nofollow" target="_blank">What do these mean?</a>
        <div className={`close button ${this.state.loading ? 'disabled loading' : ''}`}
             onClick={this.handleCreateGame}
             role="button">START</div>
      </div>
    );
  }

  handleCreateGame () {
    this.setState({ loading: true });
    api.v1.games.create({ rules: this.state.rules, ai: this.state.ai }).then((body) => {
      this.props.onGameReady(body.game);
      this.setState({ loading: false });
    });
  }

}
export default CreateGame;
