import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: '/learn', label: 'Learn', icon: '🏠' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/quests', label: 'Quests', icon: '🎯' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="sidebar">
      <h2>Tiny Talker</h2>
      <ul>
        {links.map(({ path, label, icon }) => (
          <li key={path} className={location.pathname === path ? 'active-sidebar' : ''}>
            <Link to={path}>{icon} {label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
