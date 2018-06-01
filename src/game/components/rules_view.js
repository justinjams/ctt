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
          <div className='rule'>
            <span className='rule-name'>Open: </span>
            <input name='open'
                   type='checkbox'
                   checked={this.state.OPEN}
                   onChange={this.createRulesHandler('OPEN')} />
          </div>
          <div className='rule'>
            <span className='rule-name'>Same: </span>
            <input name='same'
                   type='checkbox'
                   checked={this.state.SAME}
                   onChange={this.createRulesHandler('SAME')} />
          </div>
          <div className='close button'
               onClick={this.handleClose}
               role="button">Ready</div>
        </div>
      );
    } else return '';
  }
}
export default RulesView;