import { useEffect, useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";

import { setLocalData, getLocalData } from '../../utils/storage.js';

import styles from './switch.module.css';

function SwitchMode() {
  const [mode, setMode] = useState(() => {
    const data = getLocalData();
    if(data.mode) return data.mode;
    
    const darkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return darkScheme ? 'dark' : 'light';
  });

  useEffect(() => setLocalData("mode", mode), [mode]);

  const switchModeHandler = () => setMode(prev => prev === "light" ? "dark" : "light");

  return (
    <div className={styles.switch}>
      <label htmlFor="switch-mode" className={styles.label}>
        {mode === "light" ? <IoMoon className={styles.moon} /> : <IoSunny className={styles.sun} />}
      </label>
      <input 
        type="checkbox" 
        className="dark-theme" 
        id="switch-mode" 
        defaultChecked={mode === "dark"} 
        onChange={switchModeHandler} 
        aria-label="toggle color theme"
      />
    </div>
  );
}

export default SwitchMode