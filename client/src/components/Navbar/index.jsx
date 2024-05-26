import { memo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { RxDashboard } from "react-icons/rx";
import { GrTransaction } from "react-icons/gr";
import { IoSettingsOutline, IoNotificationsOutline, IoCalendarClearOutline, IoBarChartOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";

import styles from './navbar.module.css';

function Navbar({ isActiveGroup = false }) {
  const getClassName = useCallback((desktopOnly = false) => {
    return ({isActive}) => {
      if(desktopOnly){
        return isActive 
                ? `${styles.active} ${styles.desktop}` 
                : (!isActiveGroup ? `${styles.disabled} ${styles.desktop}` : styles.desktop);
      }else{
        return isActive 
                ? styles.active 
                : (!isActiveGroup ? styles.disabled : '');
      } 
    }
  }, [isActiveGroup]);

  return (
    <nav className={styles.navbar}>
      <NavLink className={getClassName()} to="/" aria-label="Pulpit główny">
        <RxDashboard className={styles.icon} />
        <span>Pulpit</span>
      </NavLink>
      <NavLink className={getClassName()} to="/budget" aria-label="Budżet">
        <GrTransaction className={styles.icon} />
        <span>Budżet</span>
      </NavLink>
      <NavLink className={getClassName()} to="/plan" aria-label="Plan finansowy">
        <IoCalendarClearOutline className={styles.icon} />
        <span>Plan</span>
      </NavLink>
      <NavLink className={getClassName(true)} to="/analysis" aria-label="Analiza finansowa">
        <IoBarChartOutline className={styles.icon} />
        <span>Analiza</span>
      </NavLink>
      <NavLink className={getClassName(true)} to="/notifications" aria-label="Powiadomienia">
        <IoNotificationsOutline className={styles.icon} />
        <span>Powiadomienia</span>
      </NavLink>
      <NavLink className={getClassName()} to="/settings" aria-label="Ustawienia">
        <IoSettingsOutline className={styles.icon} />
        <span>Opcje</span>
      </NavLink>
      <NavLink className={({isActive}) => isActive ? styles.active : ''} to="/user" aria-label="Profil użytkownika">
        <AiOutlineUser className={styles.icon} />
        <span>Profil</span>
      </NavLink>
    </nav>
  )
}

export default memo(Navbar)