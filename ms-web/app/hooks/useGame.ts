import { useState, useEffect } from 'react';

interface GameData {
  id: number;
  name: string;
}

function useGame(gameId: number) {
  const [data, setData] = useState<GameData | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const gameData: GameData = await response.json();
        setData(gameData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();

    // Cleanup
    return () => {
      // İstenirse, burada herhangi bir temizleme işlemi yapılabilir
    };
  }, [gameId]);

  return { data, error };
}

export default useGame;
