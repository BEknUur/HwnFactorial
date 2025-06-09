import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [u, setU] = useState(''); const [p, setP] = useState('');
  const nav = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await login(u, p);
    nav('/tasks');
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Login</h2>
      <input placeholder="Username" value={u} onChange={e => setU(e.target.value)} />
      <input type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)} />
      <button>Sign In</button>
    </form>
  );
}
