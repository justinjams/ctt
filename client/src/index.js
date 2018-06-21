import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

fetch('/api/v1/app/start', {
  credentials: 'same-origin',
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
}).then((response) => {
  return response.json();
}).then((body) => {
  if (body) {
    ReactDOM.render(<App bgImage={body.bgImage}
                         game={body.appState.game}
                         user={body.appState.user} />, document.getElementById('root'));
  } else {
    console.error('Unable to start app');
  }
});
registerServiceWorker();
