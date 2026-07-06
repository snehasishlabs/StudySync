import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // default dark mode
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  // Apply theme attribute to html element for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Optional: you could also reflect DND state as a data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-dnd', doNotDisturb ? 'enabled' : 'disabled');
  }, [doNotDisturb]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleDoNotDisturb = () => {
    setDoNotDisturb(prev => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        doNotDisturb,
        toggleDoNotDisturb,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
