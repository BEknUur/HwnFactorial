import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LoginForm from './components/LoginForm';
import GameField, { Player } from './components/GameField';
import PlayerList from './components/PlayerList';
import { supabase } from './lib/supabase';
import { useRealtimePlayers } from './hooks/useRealtimePlayers';
import { usePlayerMovement } from './hooks/usePlayerMovement';

function getRandomColor() {
  const colors = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#4db6ac', '#f06292', '#a1887f', '#90a4ae'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;
const PLAYER_SIZE = 4;

const getCenterCoords = () => ({
  x: Math.floor(FIELD_WIDTH / 2 - PLAYER_SIZE / 2),
  y: Math.floor(FIELD_HEIGHT / 2 - PLAYER_SIZE / 2),
});

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const players = useRealtimePlayers();

  usePlayerMovement(player);

  useEffect(() => {
    // Удаление игрока при выходе
    return () => {
      if (player) {
        supabase.from('players').delete().eq('id', player.id);
      }
    };
  }, [player]);

  const handleLogin = async (name: string) => {
    const id = uuidv4();
    const color = getRandomColor();
    const { x, y } = getCenterCoords();
    const newPlayer: Player = { id, name, x, y, color };
    setPlayer(newPlayer);
    await supabase.from('players').insert([newPlayer]);
  };

  if (!player) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: 0 }}>
      <PlayerList players={players} currentPlayerId={player.id} />
      <GameField players={players} currentPlayerId={player.id} />
    </div>
  );
};

export default App;
