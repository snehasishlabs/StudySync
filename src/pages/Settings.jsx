import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme'; // We'll create a simple hook later

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [dndMode, setDndMode] = useState(false);

  const handleDnDChange = (e) => {
    setDndMode(e.target.checked);
    // For simplicity, we just toggle a CSS class on body
    document.body.dataset.dnd = e.target.checked ? 'enabled' : 'disabled';
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h1>Settings</h1>
      <div style={{ marginTop: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          Dark Mode
        </label>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={dndMode} onChange={handleDnDChange} />
          Enable Drag‑and‑Drop Visual Mode
        </label>
      </div>
    </div>
  );
};

export default Settings;
