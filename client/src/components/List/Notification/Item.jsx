import { memo } from 'react';
import { formatRelativeTime } from '../../../utils/format';

import styles from '../list.module.css';

function NotificationItem({ data }) {
  const { value, createdAt } = data;
  
  return (
    <article className={`${styles.item} ${styles.auto}`}>
      <header className={styles.header}>
        <p><span>{value}</span></p>
        <p>{formatRelativeTime(createdAt)}</p>
      </header>
    </article>
  )
}

export default memo(NotificationItem)