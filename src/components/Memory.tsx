import { useState, useEffect, useMemo } from "react";
import type { Pokemon } from "../types/pokemon";
import { getPokemon, getPokemonsByGeneration } from "../services/pokemonService";
import MemoryGrid from "./MemoryGrid";
import ScoreDisplay from "./ScoreDisplay";
import GenerationPicker from "./GenerationPicker"
import styles from "./Memory.module.css";


const TOTAL_POKEMON = 898;

const randomPokemonSelection = (total: number) => Math.floor(Math.random() * total) + 1

const getRandomPokemonsFromGeneration = (
  generationData: string[],
  count: number
): string[] => {
  const indices = new Set<number>();

  while (indices.size < Math.min(count, generationData.length)) {
    indices.add(Math.floor(Math.random() * generationData.length));
  }

  return Array.from(indices).map(i => generationData[i]);
};

interface MemoryProps {
  count?: number;
}

export default function Memory({ count = 3 }: MemoryProps) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gen, setGen] = useState<number>(0);

  const onScoreChange = (newScore: number) => setScore((prev) => prev + newScore);
  const onGenChange = (newGen: number) => setGen(newGen);


  useEffect(() => {
    async function fetchRandom() {
      setLoading(true);
      setError(null);
      setScore(0)


      try {
        if (gen === 0) {
          const ids = Array.from({ length: count }, () =>
            randomPokemonSelection(TOTAL_POKEMON)
          );

          const results = await Promise.all(ids.map((id) => getPokemon(String(id))));
          setPokemons(results);

        }
        else {
          const generationData = await getPokemonsByGeneration(gen)
          const names = getRandomPokemonsFromGeneration(generationData, count)
          const results = await Promise.all(names.map((n) => getPokemon(String(n))));
          setPokemons(results);

        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load pokemon.");
      } finally {
        setLoading(false);
      }
    }

    fetchRandom();
  }, [count, gen]);


  const mappedPokemons = useMemo(
    () => pokemons.map((p) => ({ id: p.id, name: p.name })),
    [pokemons]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Memory game</h1>
      <div className={styles.controls}>
        <ScoreDisplay score={score} />
        <GenerationPicker gen={gen} onGenerationChange={onGenChange} />
      </div>
      <MemoryGrid pokemons={mappedPokemons} onScoreChange={onScoreChange} />
    </div>
  )
}
