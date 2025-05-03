import React from 'react';

const XPBar = ({ xp }) => {
  const maxXp = 100; // Set a level-up XP threshold
  const percentage = Math.min((xp / maxXp) * 100, 100);

  return (
    <div className="xp-bar-container" style={{ margin: '10px 0' }}>
      <div style={{ fontWeight: 'bold' }}>XP: {xp}</div>
      <div style={{ background: '#e5e7eb', borderRadius: '20px', overflow: 'hidden', height: '10px' }}>
        <div
          style={{
            width: `${percentage}%`,
            background: '#10b981',
            height: '10px',
            transition: 'width 0.4s ease'
          }}
        ></div>
      </div>
    </div>
  );
};

export default XPBar;
