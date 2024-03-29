import React, { Component } from 'react';

import './styles/deck.css';

import Card from '../components/card';

import api from '../helpers/api'
import assets from '../helpers/assets'

// TODO: Avoid duping this on server and client
const PROFILE_ICONS = [...Array(29)].map((_, i) => i);

const POOL_ROW_COLUMNS = 6;

class Deck extends Component {
  constructor (props) {
    super(props);
    this.renderCard = this.renderCard.bind(this);
    this.handleSelectCardBacks = this.handleSelectCardBacks.bind(this);
    this.handleSelectCardBack = this.handleSelectCardBack.bind(this);
    this.handleSelectCards = this.handleSelectCards.bind(this);
    this.handlePoolScroll = this.handlePoolScroll.bind(this);
    this.state = {
      poolRowClasses: [],
      selected: 'Emblem'
    }
  }

  handlePoolScroll () {
    if (this.cardRef && this.poolRef) {
      let classes = [];
      const offset = Math.max(0, (this.poolRef.scrollTop/this.cardRef.offsetHeight|0) - 1);
      console.log(offset)
      for(let i = 0; i < 5; i++) {
        classes.push(`show-row-${offset + i}`);
      }
      this.setState({ poolRowClasses: classes });
    } 
  }

  componentDidMount () {
    this.handlePoolScroll();
  }

  render () {
    return (
      <div className='deck-view appears'>
        <h2 className='header deck-editor-title'>Deck Editor</h2>
        <div className='selectables'>
          <div className={`card-back ${this.state.selected === 'Emblem' ? 'selected' : ''}`} ref={(e) => this.cardRef = e} >
            {this.renderCardBack(this.props.user.profileIcon, 0, this.handleSelectCardBacks)}
          </div>
          {[0,1,2,3,4].map(this.renderCard)}
          <ul>
            <li>Emblem</li>
            <li>Card 1</li>
            <li>Card 2</li>
            <li>Card 3</li>
            <li>Card 4</li>
            <li>Card 5</li>
          </ul>
        </div>
        <h2 className='header pool-title'>Your {this.state.selected}s</h2> 
        <div className='pool-wrap'>
          <div className={`pool ${this.state.poolRowClasses.join(' ')}`}
               ref={(e) => this.poolRef = e}
               onScroll={this.handlePoolScroll}>
            {this.renderPool()}
          </div>
        </div>
      </div>
    );
  }

  renderPool () {
    if (this.state.selected === 'Emblem') {
      const profileIcons = PROFILE_ICONS.filter((icon) => icon !== this.props.user.profileIcon);
      return profileIcons.map((icon, i) => {
        return this.renderCardBack(icon, i, this.handleSelectCardBack(icon));
      });
    } else if (this.state.selected === 'Card') {
      const handKeys = this.props.user.hand.map((card) => card.key);
      const cards = this.props.user.cards.filter((card) => handKeys.indexOf(card.key) < 0);
      return cards.map((card, i) => (
        <div className={`row-${i/POOL_ROW_COLUMNS|0}`} key={i}>
          <Card handleClick={this.handleSelectCard(card)} card={card} />
        </div>
      ));
    }
  }

  renderCardBack (icon, i, callback) {
    const img = assets.getProfileIcon(icon);

    return (
      <div className={`row-${i/POOL_ROW_COLUMNS|0}`} key={i}>
        <div className='card-view' role="button" onClick={callback} key={i}>
          <div className="side">
            <img height={122} width={122} src={img} alt="" />
          </div>
        </div>
      </div>
    );
  }

  renderCard (i) {
    const card = this.props.user.hand[i];
    const className = `card ${this.state.selected === 'Card' && this.state.selectedId === i ? 'selected' : ''} row-${i/POOL_ROW_COLUMNS|0}`;
    return (
      <div className={className} key={i}>
        <Card handleClick={this.handleSelectCards(i)} className={className} card={card} />
      </div>
    );
  }

  handleSelectCardBacks () {
    this.setState({ selected: 'Emblem' });
  }

  handleSelectCardBack (profileIcon) {
    return () => {
      api.v1.users.update(this.props.user.id, { profileIcon });
    };
  }

  handleSelectCards (i) {
    return () => {
      this.setState({ selected: 'Card', selectedId: i });
    };
  }

  handleSelectCard (card) {
    return () => {
      const hand = this.props.user.hand.map((card) => card.key);
      hand.splice(this.state.selectedId, 1, card.key);
      api.v1.users.update(this.props.user.id, { hand });
    };
  }
}

export default Deck;
