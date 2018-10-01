import React, { Component } from 'react';

class Footer extends Component {
  render () {
    return (
      <footer>
        <div className='footer-body'>
          <a href="/about.html" target="_blank" rel="noopener noreferrer">About</a>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <a href="http://ffxivtriad.com/rules" rel="noopener noreferrer nofollow" target="_blank">Rules</a>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <a href="https://goo.gl/forms/lsSePDtIdXojtCMM2" rel="noopener noreferrer nofollow" target="_blank">Contact</a>
        </div>
      </footer>
    );
  }
}

export default Footer;
