import { useState } from 'react';
import styles from './GenerationPicker.module.css';

interface GenProps{
    onGenerationChange: (gen: number) => void,
    gen : number, 
}

export default function GenerationPicker({ gen,onGenerationChange }: GenProps) {
//    const [generation, setGeneration] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 9);
      //  setGeneration(value);
        onGenerationChange(value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label htmlFor="generation">Generation</label>
                <span className={styles.hint}>Choosing 0 gets all pokemons</span>
            </div>
            <input
                type="number"
                id="generation"
                value={gen}
                min="0"
                max="9"
                step="1"
                onChange={handleChange}
            />
        </div>
    );
}