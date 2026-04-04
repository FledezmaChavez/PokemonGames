import type { Pokemon } from '../types/pokemon';
import styles from './PokemonCard.module.css';

interface Props {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: Props) {
  return (
    <div className={styles.card}>
      <img
        className={styles.sprite}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
        alt={pokemon.name}
      />
      <h2 className={styles.name}>{pokemon.name}</h2>
      <p className={styles.meta}>#{pokemon.id} · {pokemon.height * 10}cm · {pokemon.weight / 10}kg</p>

      <div className={styles.divider} />

      <div className={styles.grid}>
        <div className={styles.section}>
          <h3>Types</h3>
          <div className={styles.tags}>
            {pokemon.types.map((type) => (
              <span key={type} className={`${styles.tag} ${styles[type]}`}>{type}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Abilities</h3>
          <div className={styles.tags}>
            {pokemon.abilities.map((ability) => (
              <span key={ability} className={styles.tag}>{ability}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
