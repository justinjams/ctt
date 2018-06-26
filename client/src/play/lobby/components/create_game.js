import React, { Component } from 'react';

import api from '../../../helpers/api';

class CreateGame extends Component {
  constructor (props) {
    super(props);

    this.state = { rules: {}, solo: null };

    this.handleCreateGame = this.handleCreateGame.bind(this);
  }

  createRulesHandler (prop) {
    return (e) => {
      const newRules = Object.assign({ [prop]: e.target.checked }, this.state.rules);
      this.setState({ rules: newRules });
    }
  }

  render () {
    return (
      <div className='rules-view'>
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
        <div className='rule'>
          <span className='rule-name'>Solo: </span>
          <input name='solo'
                 type='checkbox'
                 checked={this.state.solo}
                 onChange={() => this.setState({solo: !this.state.solo})} />
        </div>
        <div className='close button'
             onClick={this.handleCreateGame}
             role="button">CREATE</div>
      </div>
    );
  }

  handleCreateGame () {
    api.v1.games.create({ rules: this.state.rules, solo: this.state.solo }).then((body) => {
      this.props.onGameReady(body.game);
    });
  }

}
export default CreateGame;
