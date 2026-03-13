import React, { useState } from 'react';
import './Sidebar.css';

/**
 * Zygote UI Overlay - Sidebar
 * Provides a high-quality floating menu on the left side of the screen.
 * Mimics the 'Zygote Body' aesthetic: dark, semi-transparent grey background,
 * white sans-serif text, and a sleek, modern look.
 */
const Sidebar = () => {
  const [controls, setControls] = useState({
    skin: true,
    muscular: false,
    skeletal: true,
    nervous: false,
  });

  const toggleControl = (key) => {
    setControls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="zygote-sidebar">
      <h2 className="zygote-title">Anatomy Viewer</h2>
      <div className="zygote-controls">
        <ToggleSwitch
          label="Skin"
          checked={controls.skin}
          onChange={() => toggleControl('skin')}
        />
        <ToggleSwitch
          label="Muscular System"
          checked={controls.muscular}
          onChange={() => toggleControl('muscular')}
        />
        <ToggleSwitch
          label="Skeletal System"
          checked={controls.skeletal}
          onChange={() => toggleControl('skeletal')}
        />
        <ToggleSwitch
          label="Nervous System"
          checked={controls.nervous}
          onChange={() => toggleControl('nervous')}
        />
      </div>
    </div>
  );
};

const ToggleSwitch = ({ label, checked, onChange }) => (
  <label className="zygote-toggle">
    <span className="zygote-label">{label}</span>
    <div className="zygote-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="zygote-slider"></span>
    </div>
  </label>
);

export default Sidebar;
