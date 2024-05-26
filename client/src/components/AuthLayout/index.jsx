import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './layout.module.css';
import DRAW_URL from '../../assets/draw.svg';

export function Component() {
  const { user } = useSelector(state => state.app);
  const location = useLocation();

  if(user) return <Navigate to={location?.state?.pathname || "/"} />

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <Outlet />
        <div className={styles.draw}>
          <img src={DRAW_URL} alt="projections from undraw.co" />
        </div>
      </div>
      <p className={styles.copyright}>&copy; Marta Zaorska {new Date().getFullYear()}</p>
    </section>
  )
}

Component.displayName = "AuthLayout";