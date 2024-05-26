import { ThreeDots } from 'react-loader-spinner';

import styles from './loader.module.css';

function InfinityLoader() {
  return (
    <div className={styles.loader}>
      <ThreeDots visible={true} height="50" width="50" color="#2f63e4" radius="5" ariaLabel="three-dots-loading" />
    </div>
  )
}

export default InfinityLoader