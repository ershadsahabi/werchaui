'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      document.documentElement.classList.add('light');
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('light')) {
      html.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="تغییر حالت روز و شب"
    >
      <span className={`${styles.slider} ${isLight ? styles.slideRight : ''}`} />
      <span className={styles.icon}>{isLight ? '☀️' : '🌙'}</span>
    </button>
  );
}
