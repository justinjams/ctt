const api = {};
api.v1 = {};

const v1Request = (options) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-Requested-With', 'XMLHttpRequest');

  const params = {
    credentials: 'same-origin',
    headers: headers,
    method: options.method
  };
  if (options.body) {
    params.body = JSON.stringify(options.body);
  }
  return fetch(options.url, params).then((response) => {
    return response.json()
  });
};

api.v1.request = (method, url) => {
 return v1Request({ method, url });
};

api.v1.games = {};

api.v1.games.create = (body) => {
  return v1Request({ body, method: 'POST', url: '/api/v1/games/new' });
};

api.v1.games.forfeit = (gameId) => {
  return v1Request({ method: 'POST', url: `/api/v1/games/${gameId}/forfeit` });
};

api.v1.games.index = () => {
  return v1Request({ method: 'GET', url: '/api/v1/games' });
};

api.v1.games.join = (gameId) => {
  return v1Request({ method: 'POST', url: `/api/v1/games/${gameId}/join` });
};

api.v1.games.play = (gameId, body) => {
  return v1Request({ body, method: 'POST', url: `/api/v1/games/${gameId}/play` });
};

api.v1.sessions = {};

api.v1.sessions.create = (body) => {
  return v1Request({body, method: 'POST', url: '/api/v1/sessions/new' });
};

api.v1.sessions.delete = () => {
  return v1Request({ method: 'DELETE', url: '/api/v1/sessions' });
};

api.v1.users = {};

api.v1.users.create = (body) => {
  return v1Request({ body, method: 'POST', url: '/api/v1/users/new' });
};

api.v1.users.update = (userId, body) => {
  return v1Request({ body, method: 'POST', url: `/api/v1/users/${userId}` });
};

export default api;