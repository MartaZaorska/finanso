import ANALYSIS_DRAW from '../../assets/analysis.png';
import styles from './details.module.css';

function AnalysisDetails() {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2><span>Analiza finansowa</span></h2>
        </header>
      </div>
      <div className={styles.draw}>
        <img src={ANALYSIS_DRAW} alt="analysis icon" />
      </div>
    </section>
  )
}

export default AnalysisDetails