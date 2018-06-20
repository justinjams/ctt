import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import Welcome from './welcome/welcome'
import registerServiceWorker from './registerServiceWorker';

fetch('/api/v1/app/start', {
  credentials: 'same-origin',
  headers: {
      "X-Requested-With": "XMLHttpRequest"
  }
}).then((response) => {
  return response.json();
}).then((body) => {
  console.log(body);
  if (body) {
    if (body.appState.game) {
      ReactDOM.render(<App bgImage={body.bgImage}
                           game={body.appState.game}
                           user={body.bappState.user} />, document.getElementById('root'));
    } else {
      ReactDOM.render(<Welcome bgImage={body.bgImage} />, document.getElementById('root'));
    }
  }
});
registerServiceWorker();
