import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from '../Navbar';
import styles from './protected.module.css';

function Protected() {
  const { user, activeGroup } = useSelector(state => state.app);
  const { pathname } = useLocation();

  if(!user) return <Navigate to="/auth" state={{ pathname }} />

  return (
    <>
      <main className={styles.wrapper}>
        <Outlet />
      </main>
      <Navbar isActiveGroup={activeGroup !== null} />
    </>
  )
}

export default Protected;