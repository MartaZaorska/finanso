import NOTIFICATION_DRAW from '../../assets/notification.png';
import styles from './details.module.css';

function NotificationDetails() {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2><span>Powiadomienia</span></h2>
        </header>
      </div>
      <div className={styles.draw}>
        <img src={NOTIFICATION_DRAW} alt="notification icon" />
      </div>
    </section>
  )
}

export default NotificationDetails