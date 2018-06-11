import React, { Component } from 'react';

class MenuView extends Component {
  constructor (props) {
    super(props);

    this.state = { rules: {} };

    this.startSinglePlayer = this.startSinglePlayer.bind(this);
  }

  createRulesHandler (prop) {
    return (e) => {
      const newRules = Object.assign({[prop]: e.target.checked }, this.state.rules)
      this.setState({ rules: newRules });
    }
  }

  render () {
    return (
      <div className='rules-view'>
        {['OPEN', 'SAME', 'PLUS'].map((rule, i)=>{
          return (
            <div className='rule' key={i}>
              <span className='rule-name'>{rule}: </span>
              <input name={rule}
                     type='checkbox'
                     checked={this.state[rule]}
                     onChange={this.createRulesHandler(rule)} />
            </div>
          );
        })}
        <div className='close button'
             onClick={this.startSinglePlayer}
             role="button">Create Game</div>
      </div>
    );
  }

  startSinglePlayer () {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const params = {
      body: JSON.stringify({ rules: this.state.rules }),
      headers: headers,
      method: 'POST'
    };
    fetch('/api/v1/games/new', params).then((response) => {
      response.json().then((body) => {
        this.props.onGameReady(body);
      });
    });
  }

}
export default MenuView;