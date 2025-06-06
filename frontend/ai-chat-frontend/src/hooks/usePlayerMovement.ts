import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Player } from '../components/GameField';

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;
const PLAYER_SIZE = 4;

const MOVE_STEP = 1;

export function usePlayerMovement(player: Player | null) {
  const playerRef = useRef(player);
  playerRef.current = player;

  useEffect(() => {
    if (!player) return;

    function handleKeyDown(e: KeyboardEvent) {
      let { x, y } = playerRef.current!;
      let moved = false;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ц' || e.key === 'Ц') {
        if (y > 0) { y -= MOVE_STEP; moved = true; }
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ы' || e.key === 'Ы') {
        if (y < FIELD_HEIGHT - PLAYER_SIZE) { y += MOVE_STEP; moved = true; }
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
        if (x > 0) { x -= MOVE_STEP; moved = true; }
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
        if (x < FIELD_WIDTH - PLAYER_SIZE) { x += MOVE_STEP; moved = true; }
      }
      if (moved) {
        supabase.from('players').update({ x, y }).eq('id', playerRef.current!.id);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player]);
} 