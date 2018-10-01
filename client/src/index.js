import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';

import api from './helpers/api';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

api.v1.request('get', '/api/v1/app/start').then((body) => {
  if (body) {
    ReactDOM.render(
      <BrowserRouter>
        <App bgImage={body.bgImage}
                     game={body.appState.game}
                     gameInviteId={body.appState.gameInviteId}
                     user={body.appState.user} />
      </BrowserRouter>,
      document.getElementById('root')
    );
  } else {
    console.error('Unable to start app');
  }
});
//registerServiceWorker();
