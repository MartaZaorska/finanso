import { 
  Transaction,
  Group,
  Goal,
  Payment,
  Analysis,
  Notification
} from '../../components/Dashboard';

import styles from './dashboard.module.css';

export function Component() {
  return (
    <section className={styles.container}>
      <Group />
      <div className={styles.mainRow}>
        <div className={styles.column}>
          <div className={styles.row}>
            <Transaction />
            <Analysis />
          </div>
          <div className={styles.row}>
            <Goal />
            <Payment />
          </div>
        </div>
        <Notification />
      </div>
    </section>
  )
}

Component.displayName = "Dashboard";