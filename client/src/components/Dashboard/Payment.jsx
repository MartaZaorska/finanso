import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { formatCurrency, formatDate } from '../../utils/format';

import styles from './dashboard.module.css';

function Payment() {
  const { activeGroup: { payments, currency } } = useSelector(state => state.app);

  const sortedPayments = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return [...payments].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate)).slice(0, 2).map(item => {
      const diff = new Date(item.targetDate) - new Date(today);
      return diff === 0 
        ? { ...item, className: styles.green }
        : (diff < 0 ? { ...item, className: styles.error } : { ...item, className: '' });
    });
  }, [payments]);

  return (
    <section className={`${styles.box} ${styles.payment}`}>
      <header className={styles.header}>
        <h3>Terminarz płatności</h3>
        <Link to="/plan" className={styles.link}>Więcej</Link>
      </header>
      <div className={styles.content}>
        {sortedPayments.map(payment => (
          <article className={styles.item} key={payment._id}>
            <p className={styles.block}>
              <mark className={styles.blue}>{payment.name}</mark>
              <span>{formatCurrency(payment.value, currency)}</span>
            </p>
            <p>
              <mark className={payment.className}>{formatDate(payment.targetDate)}</mark>
            </p>
          </article>
        ))}
        {payments.length === 0 && <p className={styles.message}>Brak przyszłych płatności</p>}
      </div>
    </section>
  )
}

export default Payment