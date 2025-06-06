import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (name: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 100 }}>
      <input
        type="text"
        placeholder="Введите ник"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={16}
        style={{ padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
        autoFocus
      />
      <button type="submit" style={{ padding: '8px 16px', fontSize: 16, borderRadius: 4, background: '#222', color: '#fff', border: 'none' }}>
        Войти
      </button>
    </form>
  );
};

export default LoginForm; 