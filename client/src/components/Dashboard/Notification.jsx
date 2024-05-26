import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { formatDate } from '../../utils/format';

import styles from './dashboard.module.css';

function Notification() {
  const { activeGroup: { notifications } } = useSelector(state => state.app);

  return (
    <section className={`${styles.box} ${styles.notification}`}>
      <header className={styles.header}>
        <h3>Powiadomienia</h3>
        <Link to="/notifications" className={styles.link}>Więcej</Link>
      </header>
      <div className={styles.content}>
        {notifications.slice(0, 3).map(notification => (
          <article className={`${styles.item} ${styles.notificationItem}`} key={notification._id}>
            <p className={styles.block}>
              <span>{notification.value}</span>
              <mark>{formatDate(notification.createdAt, true)}</mark>
            </p>
          </article>
        ))}
        {notifications.length === 0 && <p className={styles.message}>Brak powiadomień</p>}
      </div>
    </section>
  )
}

export default Notification