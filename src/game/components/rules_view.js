import React, { Component } from 'react';

class RulesView extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.handleClose = this.handleClose.bind(this);
    this.createRulesChandler = this.createRulesChandler.bind(this);
  }

  getInitialState () {
    return {
      rulesOpen: true,
      rules: Object.assign({}, this.props.game.rules)
    }
  }

  handleClose () {
    this.setState({ rulesOpen: false });
    this.props.handleRuleChange();
  }

  createRulesChandler (prop) {
    return (e) => {
      let newRules = {}
      newRules[prop] = e.target.value === 'on';
      this.props.game.setRule(prop, newRules[prop])
      this.setState({ rules: newRules });
      console.log(this.state);
    }
  }

  render () {
    if (this.state.rulesOpen) {
      return (
        <div className='rules-view'>
          <div className='rule'>
            <span>Open: </span>
            <input name="open"
                   type="checkbox"
                   checked={this.state.rules.open}
                   onChange={this.createRulesChandler('OPEN')} />
          </div>
          <div onClick={this.handleClose}>close</div>
        </div>
      );
    } else return '';
  }
}
export default RulesView;