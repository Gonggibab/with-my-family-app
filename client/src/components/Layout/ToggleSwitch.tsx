import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { updateIsDarkMode } from 'redux/_slices/appSlice';

import styles from 'styles/components/Layout/ToggleSwitch.module.scss';

export default function ToggleSwitch() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.app.isDarkMode);

  const onToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theme = e.target.checked ? 'dark' : 'light';
    dispatch(updateIsDarkMode(theme === 'dark'));
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={(e) => onToggle(e)}
        hidden
      />
      <span className={styles.slider}></span>
    </label>
  );
}
