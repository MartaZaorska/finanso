import GOALS_DRAW from '../../assets/goals.png';
import styles from './details.module.css';

function PlanDetails() {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2><span>Plan finansowy</span></h2>
        </header>
      </div>
      <div className={styles.draw}>
        <img src={GOALS_DRAW} alt="goals icon" />
      </div>
    </section>
  )
}

export default PlanDetails