import { useMemo, useState } from 'react';
import styles from './MemoryGrid.module.css';

interface PokemonCell {
  id: number;
  name: string;
}

interface Props {
  pokemons: PokemonCell[];
  onScoreChange: (newScore: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ARTWORK_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export default function MemoryGrid({ pokemons, onScoreChange }: Props) {
  const cells = useMemo(
  () => {
    const withIds = pokemons.flatMap((p, i) => [
      { ...p, uniqueId: `${p.id}-0` },
      { ...p, uniqueId: `${p.id}-1` },
    ]);
    return shuffle(withIds);
  },
  [pokemons]
);

  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const cols = Math.ceil(Math.sqrt(cells.length));

  function isVisible(i: number): boolean {
    return matchedIds.has(cells[i].uniqueId) || selected.includes(i);
  }

  function handleClick(i: number) {
    if (locked || isVisible(i)) return;

    if (selected.length === 0) {
      setSelected([i]);
      return;
    }

    const first = selected[0];
    setSelected([first, i]);

    if (cells[first].name === cells[i].name) {
      setMatchedIds(prev => new Set([...prev, cells[first].uniqueId, cells[i].uniqueId]));
      setSelected([]);
      onScoreChange(1);
    } else {
      setLocked(true);
      setTimeout(() => {
        setSelected([]);
        setLocked(false);
      }, 1000);
    }
  }

  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cells.map((pokemon,i) => (
        <div
          key={pokemon.uniqueId}
          className={styles.cardScene}
          onClick={() => handleClick(i)}
        >
          <div className={`${styles.card} ${isVisible(i) ? styles.cardFlipped : ''}`}>
            <div className={styles.cardFront}>
              <div className={styles.pokeball} />
            </div>
            <div className={styles.cardBack}>
              <img
                className={styles.image}
                src={ARTWORK_URL(pokemon.id)}
                alt={pokemon.name}
                loading="lazy"
              />
              <span className={styles.name}>{pokemon.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
