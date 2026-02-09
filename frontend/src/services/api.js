const API = (base = process.env.REACT_APP_API_URL || 'http://localhost:4000') => {
  const baseUrl = base;

  const post = (path, body, token) => fetch(`${baseUrl}${path}`, {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }, body: JSON.stringify(body)
  }).then(r => r.json());

  const get = (path, token) => fetch(`${baseUrl}${path}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  }).then(r => r.json());

  return {
    register: (body) => post('/auth/register', body),
    login: (body) => post('/auth/login', body),
    fetchUsers: (token) => get('/api/users', token),
    fetchCourses: (token) => get('/api/courses', token),
    requestSession: (token, body) => post('/api/sessions/request', body, token),
    respondSession: (token, body) => post('/api/sessions/respond', body, token),
  };
};

export default API();
