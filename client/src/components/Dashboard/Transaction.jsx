import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { formatCurrency } from '../../utils/format';
import { INCOME_CATEGORIES, EXPENSES_CATEGORIES } from '../../data';

import styles from './dashboard.module.css';

const CATEGORIES = { ...INCOME_CATEGORIES, ...EXPENSES_CATEGORIES };

function Transaction() {
  const { activeGroup: { income, expenses, currency } } = useSelector(state => state.app);
  
  const sortedTransaction = useMemo(() => {
    return [
      ...income.map(item => ({ ...item, type: 'income' })), 
      ...expenses.map(item => ({ ...item, type: 'expenses' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  }, [income, expenses]);
  
  return (
    <section className={`${styles.box} ${styles.transaction}`}>
      <header className={styles.header}>
        <h3>Ostatnie transakcje</h3>
        <Link to="/budget" className={styles.link}>Więcej</Link>
      </header>
      <div className={styles.content}>
        {sortedTransaction.map(transaction => (
          <article className={styles.item} key={transaction._id}>
            <p className={styles.block}>
              <mark className={styles.blue}>{CATEGORIES[transaction.category]}</mark>
              <span>{transaction.user.name} {transaction.user.surname}</span>
            </p>
            <p>
              <mark className={styles[transaction.type]}>
                {transaction.type === "expenses" && "-"}{formatCurrency(transaction.value, currency)}
              </mark>
            </p>
          </article>
        ))}
        {sortedTransaction.length === 0 && <p className={styles.message}>Brak transakcji</p>}
      </div>
    </section>
  )
}

export default Transaction