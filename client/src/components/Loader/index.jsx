import { Rings } from 'react-loader-spinner';

import styles from './loader.module.css';

function Loader() {
  return (
    <div className={styles.wrapper}>
      <Rings
        height={100}
        width={100}
        radius={7}
        color="#2f63e4"
        ariaLabel="rings-loading"
        visible={true}
      />
    </div>
  )
}

export default Loader