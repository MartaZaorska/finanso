import { useMemo, memo } from 'react';

import { formatDate, formatCurrency } from '../../../utils/format';

import styles from '../list.module.css';

function GroupItem({ 
  data, 
  active, 
  changeActiveGroup 
}){
  const { _id, name, currency, users, admins, updatedAt, totalIncome, totalExpenses } = data;

  const balance = useMemo(() => totalIncome - totalExpenses, [totalExpenses, totalIncome]);
  const numberOfUsers = useMemo(() => users.length + admins.length, [users, admins]);

  return (
    <article 
      onClick={() => changeActiveGroup(_id)} 
      className={active ? `${styles.success} ${styles.item}` : styles.item} 
      data-value="Active"
    >
      <header className={styles.header}>
        <h3>{name}</h3>
        <p>Data ostatniej modyfikacji: <span>{formatDate(updatedAt, true)}</span></p>
        <p>Ilość użytkowników: <span>{numberOfUsers}</span></p>
      </header>
      <p className={styles.balance}>Bilans: <mark>{formatCurrency(balance, currency)}</mark></p>
    </article>
  )
}

export default memo(GroupItem);