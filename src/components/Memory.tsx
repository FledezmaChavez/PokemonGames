import { useState, useEffect, useMemo } from "react";
import type { Pokemon } from "../types/pokemon";
import { getPokemon } from "../services/pokemonService";
import MemoryGrid from "./MemoryGrid";
import ScoreDisplay from "./ScoreDisplay";

const TOTAL_POKEMON = 898;

interface MemoryProps {
  count?: number;
}

export default function Memory({ count = 3 }: MemoryProps) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const onScoreChange = (newScore: number) => setScore((prev) => prev + newScore);
  


  useEffect(() => {
    async function fetchRandom() {
      setLoading(true);
      setError(null);
      setScore(0)

      try {
        const ids = Array.from({ length: count }, () =>
          Math.floor(Math.random() * TOTAL_POKEMON) + 1
        );
        const results = await Promise.all(ids.map((id) => getPokemon(String(id))));
        setPokemons(results);
      } catch {
        setError("Failed to load pokemon.");
      } finally {
        setLoading(false);
      }
    }

    fetchRandom();
  }, [count]);

  
  const mappedPokemons = useMemo(
    () => pokemons.map((p) => ({ id: p.id, name: p.name })),
    [pokemons]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <ScoreDisplay score={score} />
    <MemoryGrid pokemons={mappedPokemons} onScoreChange={onScoreChange} />
    </>
  )
}
