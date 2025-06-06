import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Player } from '../components/GameField';

export function useRealtimePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let ignore = false;
    async function fetchPlayers() {
      const { data } = await supabase.from('players').select('*');
      if (!ignore && data) setPlayers(data as Player[]);
    }
    fetchPlayers();

    const channel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        payload => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return players;
} 