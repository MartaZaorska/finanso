import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { formatCurrency, formatAsPercentage } from '../../utils/format';

import styles from './dashboard.module.css';

function Goal() {
  const { activeGroup: { goals, currency, totalIncome, totalExpenses } } = useSelector(state => state.app);

  const balance = useMemo(() => totalIncome - totalExpenses, [totalExpenses, totalIncome]);
  const sortedGoals = useMemo(() => [...goals].sort((a, b) => a.value - b.value).slice(0, 2), [goals]);

  return (
    <section className={`${styles.box} ${styles.goal}`}>
      <header className={styles.header}>
        <h3>Cele finansowe</h3>
        <Link to="/plan" className={styles.link}>Więcej</Link>
      </header>
      <div className={styles.content}>
        {sortedGoals.map(goal => (
          <article className={styles.item} key={goal._id}>
            <p className={styles.block}>
              <mark className={styles.blue}>{goal.name}</mark>
              <span>{formatCurrency(goal.value, currency)}</span>
            </p>
            <p>
              <mark className={balance >= goal.value ? styles.green : ''}>
                {formatAsPercentage(balance / goal.value, 0, 0)}
              </mark>
            </p>
          </article>
        ))}
        {goals.length === 0 && <p className={styles.message}>Brak celów finansowych</p>}
      </div>
    </section>
  )
}

export default Goal