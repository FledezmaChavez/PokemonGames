import styles from './ScoreDisplay.module.css';

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>SCORE</div>
      <div className={styles.scoreValue}>{score.toString().padStart(3, '0')}</div>
    </div>
  );
}