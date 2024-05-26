import { memo } from 'react';
import { formatAsPercentage } from '../../utils/format';

import styles from './progress.module.css';

const ProgressCircle = ({ progress }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * progress);

  return (
    <div className={styles.progress}>
      <svg className={styles.svg}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#132553', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2f63e4', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={radius} className={styles.background}></circle>
        <circle
          cx="40"
          cy="40"
          r={radius}
          className={styles.circle}
          stroke="url(#progressGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        ></circle>
      </svg>
      <div className={styles.number}>{formatAsPercentage(progress, 0, 0)}</div>
    </div>
  );
}

export default memo(ProgressCircle);