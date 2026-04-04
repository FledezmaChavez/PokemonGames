import { useState } from 'react';
import Home from './components/Home';
import SearchBar from './components/SearchBar';
import PokemonCard from './components/PokemonCard';
import Memory from './components/Memory';
import { getPokemon } from './services/pokemonService';
import type { Pokemon } from './types/pokemon';
import styles from './App.module.css';

export default function App() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function handleSearch(name: string) {
    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const result = await getPokemon(name);
      setPokemon(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Home selectedId={selectedId} onSelect={setSelectedId}>
      {selectedId === 'search' && (
        <>
          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && <p className={styles.error}>{error}</p>}
          {pokemon && <PokemonCard pokemon={pokemon} />}
        </>
      )}
      {selectedId === 'memory' && <Memory />}
    </Home>
  );
}
