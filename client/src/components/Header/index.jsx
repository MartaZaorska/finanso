import { useSelector, useDispatch } from 'react-redux';
import { RiLogoutCircleRLine } from "react-icons/ri";

import { useLogoutMutation } from '../../app/apiUser.js';

import SwitchMode from '../SwitchMode';

import LOGO_URL from '../../assets/logo.png';
import styles from './header.module.css';

function Header() {
  const { user } = useSelector(state => state.app);

  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutUser();
      const { logout } = await import("../../app/appSlice.js");
      dispatch(logout());
    } catch(err) {
      //console.log(`logoutHandler`, err);
    }
  }

  return (
    <header className={styles.header}>
      <img src={LOGO_URL} alt="logo" className={styles.logo} />
      <div className={styles.controls}>
        <SwitchMode />
        {user && <button onClick={logoutHandler} aria-label="wyloguj"><RiLogoutCircleRLine className={styles.icon} /></button>}
      </div>
    </header>
  )
}

export default Header