import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';

import api from './helpers/api';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

api.v1.request('get', '/api/v1/app/start').then((body) => {
  if (body) {
    ReactDOM.render(<App bgImage={body.bgImage}
                         game={body.appState.game}
                         user={body.appState.user} />, document.getElementById('root'));
  } else {
    console.error('Unable to start app');
  }
});
registerServiceWorker();
