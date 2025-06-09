import { useEffect, useState } from 'react';
import api from '../services/api';

interface Task { id: number; title: string; description: string; }

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [t, setT] = useState(''); const [d, setD] = useState('');

  useEffect(() => {
    api.get('/tasks/').then(res => setTasks(res.data));
  }, []);

  const add = async () => {
    const { data } = await api.post('/tasks/', { title: t, description: d });
    setTasks(prev => [...prev, data]);
    setT(''); setD('');
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <ul>
        {tasks.map(x => <li key={x.id}>{x.title}: {x.description}</li>)}
      </ul>
      <input placeholder="Title" value={t} onChange={e => setT(e.target.value)} />
      <input placeholder="Desc" value={d} onChange={e => setD(e.target.value)} />
      <button onClick={add}>Create</button>
    </div>
  );
}
