import { useState } from 'react';
import styles from './SearchBar.module.css';

interface Props {
  onSearch: (name: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [input, setInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Enter a pokemon name..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <button className={styles.button} type="submit" disabled={loading || !input.trim()}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
