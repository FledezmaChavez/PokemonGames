import styles from './Home.module.css';

interface Props {
  children: React.ReactNode;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const menuItems = [
  {
    id: 'search',
    label: 'Search Pokemon',
    sub: 'Look up any pokemon by name',
    icon: '◈',
    active: false,
  },
  {
    id: 'guess',
    label: 'Guess the Pokemon',
    sub: 'Test your knowledge',
    icon: '◉',
    active: false,
  },
  {
    id: 'evolution',
    label: 'See Evolution Line',
    sub: 'Explore evolution chains',
    icon: '◎',
    active: false,
  },
  {
    id: 'memory', 
    label: 'Play memory game', 
    sub:'Help a pokemon memory game', 
    icon: '@', 
    active: true
  }
];

export default function Home({ children, selectedId, onSelect }: Props) {

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.titlePrefix}>— </span>
          <h1 className={styles.title}>
            Pokemon API
            <span className={styles.bangs}>!!!</span>
          </h1>
          <span className={styles.titlePrefix}> —</span>
        </div>
        <p className={styles.subtitle}>/ / / terminal interface v1.0 / / /</p>
      </header>

      <nav className={styles.menu}>
        {menuItems.map((item, i) => (
          <div
            key={item.id}
            className={[
              styles.card,
              item.active ? styles.cardActive : styles.cardDisabled,
              selectedId === item.id ? styles.cardOpen : '',
            ].join(' ')}
            style={{ animationDelay: `${i * 80}ms` }}
            onClick={() => item.active && onSelect(selectedId === item.id ? null : item.id)}
            role={item.active ? 'button' : undefined}
            tabIndex={item.active ? 0 : undefined}
            onKeyDown={(e) =>
              item.active && e.key === 'Enter' && onSelect(selectedId === item.id ? null : item.id)
            }
          >
            <span className={styles.cardIndex}>0{i + 1}</span>

            <span className={styles.cardIcon}>{item.icon}</span>

            <div className={styles.cardBody}>
              <span className={styles.cardLabel}>{item.label}</span>
              <span className={styles.cardSub}>{item.sub}</span>
            </div>

            {item.active ? (
              <span
                className={[styles.cardArrow, selectedId === item.id ? styles.arrowDown : ''].join(' ')}
              >
                ›
              </span>
            ) : (
              <span className={styles.badge}>SOON</span>
            )}

            <div className={styles.scanline} />
          </div>
        ))}
      </nav>

      {selectedId && (
        <div className={styles.panel}>
          <div className={styles.panelInner}>{children}</div>
        </div>
      )}
    </div>
  );
}
