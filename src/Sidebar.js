import React, { useState } from 'react';

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

      <style dangerouslySetInnerHTML={{ __html: `
        .zygote-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 100vh;
          background: rgba(45, 45, 45, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 10;
          padding: 24px;
          box-sizing: border-box;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #ffffff;
          box-shadow: 2px 0 15px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
        }

        .zygote-title {
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 1px;
          margin-bottom: 32px;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
        }

        .zygote-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .zygote-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .zygote-label {
          font-size: 14px;
          font-weight: 400;
          user-select: none;
        }

        /* Custom Checkbox Toggle Style */
        .zygote-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .zygote-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .zygote-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.2);
          transition: .4s;
          border-radius: 24px;
        }

        .zygote-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .zygote-slider {
          background-color: #4CAF50;
        }

        input:focus + .zygote-slider {
          box-shadow: 0 0 1px #4CAF50;
        }

        input:checked + .zygote-slider:before {
          transform: translateX(20px);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .zygote-sidebar {
            width: 100%;
            height: auto;
            bottom: 0;
            top: auto;
            border-radius: 20px 20px 0 0;
            padding: 16px;
            box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.5);
          }

          .zygote-controls {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 16px;
          }

          .zygote-toggle {
            flex: 1 1 calc(50% - 16px);
          }
        }
      `}} />
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
