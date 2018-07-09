import React, { Component } from 'react';

import api from '../../../helpers/api';

class CreateGame extends Component {
  constructor (props) {
    super(props);

    this.state = { rules: {
      OPEN: true,
      SAME: false,
      PLUS: false
    }, ai: 0 };

    this.handleCreateGame = this.handleCreateGame.bind(this);
  }

  createRulesHandler (prop) {
    return (e) => {
      const newRules = Object.assign(this.state.rules, { [prop]: e.target.checked });
      this.setState({ rules: newRules });
    }
  }

  render () {
    return (
      <div className='create-game-view rules-view appears-up'>
        <div className='header'>
          Game Settings
        </div>
        <div className='opponent'>
          <span className='rule-name'>Opponent: </span>
          <select name='ai'
                  select={this.state.ai}
                  onChange={(e) => this.setState({ ai: e.target.value })}>
            <option value={0}>Player</option>
            <option value={1}>AI (easy)</option>
          </select>
        </div>
        <div className='rules'>
          {['OPEN', 'SAME', 'PLUS'].map((rule, i)=>{
            return (
              <div className='rule' key={i}>
                <span className='rule-name'>{rule.replace(/^(.)(.*)$/, (e, l, r) => l + r.toLowerCase() )}: </span>
                <input name={rule}
                       type='checkbox'
                       checked={this.state.rules[rule]}
                       onChange={this.createRulesHandler(rule)} />
              </div>
            );
          })}
        </div>
        <a className="rules-link" href="http://ffxivtriad.com/rules" rel="noopener noreferrer nofollow" target="_blank">What do these mean?</a>
        <div className='close button'
             onClick={this.handleCreateGame}
             role="button">START</div>
      </div>
    );
  }

  handleCreateGame () {
    api.v1.games.create({ rules: this.state.rules, ai: this.state.ai }).then((body) => {
      this.props.onGameReady(body.game);
    });
  }

}
export default CreateGame;
