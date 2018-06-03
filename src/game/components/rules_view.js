import React, { Component } from 'react';

class RulesView extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.handleClose = this.handleClose.bind(this);
  }

  getInitialState () {
    return Object.assign({ rulesOpen: true }, this.props.game.rules)
  }

  handleClose () {
    this.setState({ rulesOpen: false });
    this.props.handleRulesClosed();
  }

  createRulesHandler (prop) {
    return (e) => {
      this.props.game.rules[prop] = e.target.checked;
      this.setState({ [prop]: e.target.checked });
    }
  }

  render () {
    if (this.state.rulesOpen) {
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
               onClick={this.handleClose}
               role="button">Ready</div>
        </div>
      );
    } else return '';
  }
}
export default RulesView;