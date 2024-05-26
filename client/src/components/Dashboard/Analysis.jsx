import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import useChartData from '../../hooks/useChartData';
import Chart from '../Chart';

import styles from './dashboard.module.css';

function Analysis() {
  const { activeGroup: { income, expenses } } = useSelector(state => state.app);
  const { barChartData } = useChartData({ income, expenses, numberOfMonths: 2 });

  return (
    <section className={`${styles.box} ${styles.analysis}`}>
      <header className={styles.header}>
        <h3>Analiza finansowa</h3>
        <Link className={styles.link} to='/analysis'>Więcej</Link>
      </header>
      <div className={`${styles.content}`}>
        <div className={styles.chart}>
          <Chart data={barChartData} />
        </div>
      </div>
    </section>
  )
}

export default Analysis