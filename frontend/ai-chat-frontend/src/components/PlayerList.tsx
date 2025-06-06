import React from 'react';
import { Player } from './GameField';

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
  return (
    <div style={{ margin: '0 auto', maxWidth: 300, background: '#23272e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 15 }}>
      <b>Игроки онлайн:</b>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {players.map(player => (
          <li key={player.id} style={{ display: 'flex', alignItems: 'center', margin: '6px 0', fontWeight: player.id === currentPlayerId ? 'bold' : undefined }}>
            <span style={{ display: 'inline-block', width: 16, height: 16, background: player.color, borderRadius: 3, marginRight: 8, border: player.id === currentPlayerId ? '2px solid #fff' : '1px solid #444' }} />
            {player.name}
            {player.id === currentPlayerId && <span style={{ marginLeft: 6, color: '#6cf' }}>(вы)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList; 