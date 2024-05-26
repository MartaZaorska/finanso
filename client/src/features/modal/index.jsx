import { memo } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineCloseFullscreen } from "react-icons/md";

import useModal from './hooks/useModal';

import styles from './modal.module.css';


function Modal({
  children, 
  title, 
  subtitle = "", 
  closeHandler
}) {

  const backgroundClickHandler = e => {
    if(e.target.className === styles.modal) closeHandler();
  }

  return (
    <motion.div className={styles.modal} onClick={backgroundClickHandler} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button onClick={closeHandler} aria-label="zamknij okno modalne"><MdOutlineCloseFullscreen className={styles.icon} /></button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export { useModal };
export default memo(Modal);