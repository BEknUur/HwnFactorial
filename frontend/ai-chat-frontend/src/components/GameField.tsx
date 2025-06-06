import React from 'react';

export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

interface GameFieldProps {
  players: Player[];
  currentPlayerId: string;
}

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;
const PLAYER_SIZE = 4;

const GameField: React.FC<GameFieldProps> = ({ players, currentPlayerId }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,
        background: '#181c20',
        margin: '40px auto',
        borderRadius: 12,
        boxShadow: '0 2px 16px #0008',
        overflow: 'hidden',
      }}
    >
      {players.map(player => (
        <div
          key={player.id}
          style={{
            position: 'absolute',
            left: player.x,
            top: player.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            background: player.color,
            border: player.id === currentPlayerId ? '1px solid #fff' : undefined,
            borderRadius: 2,
            transition: 'left 0.05s linear, top 0.05s linear',
          }}
          title={player.name}
        />
      ))}
    </div>
  );
};

export default GameField; 