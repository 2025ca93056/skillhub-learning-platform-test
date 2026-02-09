import React, { useState, useEffect } from 'react';
import API from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');

  useEffect(() => {
    if (token) {
      API.fetchUsers(token).then(setUsers).catch(() => setUsers([]));
      API.fetchCourses(token).then(setCourses).catch(() => setCourses([]));
    }
  }, [token]);

  const handleRegister = async () => {
    const res = await API.register({ email, password, name, role });
    if (res.token) {
      setToken(res.token); localStorage.setItem('token', res.token); setUser(res.user);
    }
  };

  const handleLogin = async () => {
    const res = await API.login({ email, password });
    if (res.token) {
      setToken(res.token); localStorage.setItem('token', res.token); setUser(res.user);
    }
  };

  const handleRequestSession = async (courseId, instructorId) => {
    await API.requestSession(token, { courseId, instructorId });
    alert('Requested');
  };

  const handleRespond = async (sessionId, action) => {
    await API.respondSession(token, { sessionId, action });
    alert('Responded');
  };

  if (!token) return (
    <div style={{ padding: 20 }}>
      <h2>UserSkillHub — Register / Login</h2>
      <div>
        <input placeholder="name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <div>
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <aside style={{ width: 240 }}>
        <h3>Users</h3>
        <ul>
          {users.map(u => <li key={u.id}>{u.name} ({u.role})</li>)}
        </ul>
      </aside>
      <main style={{ flex: 1 }}>
        <h3>Courses</h3>
        <ul>
          {courses.map(c => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              <strong>{c.title}</strong>
              <div>{c.description}</div>
              <div>
                <label>Request session with instructor id: </label>
                <input style={{ width: 80 }} id={`instr-${c.id}`} placeholder="instructorId" />
                <button onClick={() => {
                  const v = document.getElementById(`instr-${c.id}`).value;
                  handleRequestSession(c.id, v);
                }}>Request</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;