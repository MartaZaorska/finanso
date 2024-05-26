import { memo } from 'react';
import { formatCurrency } from '../../../utils/format';

import styles from '../list.module.css';

function CategoryList({ 
  data, 
  type,
  currency
}) {
  return (
    <article className={styles.container}>
      <div className={styles.content}>
        {data.map(item =>
          <div 
            key={`${item.name}-${item.totalValue}`} 
            className={`${styles.item} ${styles.category} ${styles[type]}`} 
            data-value={item.percentage}
          >
            <header className={styles.header}>
              <h3>{item.name}</h3>
              <p>Kwota: <mark>{formatCurrency(item.totalValue, currency)}</mark></p>
            </header>
          </div>
        )}
      </div>
    </article>
  )
}

export default memo(CategoryList)