import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const languages = [
  { name: 'English', flag: 'https://flagcdn.com/gb.svg', route: '/learn' },
  { name: 'Nepali', flag: 'https://flagcdn.com/np.svg', route: '/learn' }, // you can change if needed
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 to check current path

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo-inline">
          <h2 className="tiny">Tiny</h2>
          <h2 className="talker">Talker</h2>
        </div>

        <nav>
  <ul className="menu-list">
    <li className="locked">
      <span role="img" aria-label="Learn">🏠</span> Learn
    </li>
    <li className="locked">
      <span role="img" aria-label="Leaderboard">🏆</span> Leaderboard
    </li>
    <li className="locked">
      <span role="img" aria-label="Quests">🎯</span> Quests
    </li>
   

    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
      <li className={location.pathname === '/profile' ? 'active-sidebar' : ''}>
        <span role="img" aria-label="Profile">👤</span> Profile
      </li>
    </Link>
  </ul>
</nav>

      </aside>

      <main className="main-content">
        <h3 className="section-title">Language Courses</h3>
        <div className="language-grid">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="language-card"
              onClick={() => navigate(lang.route)}
              style={{ cursor: 'pointer' }}
            >
              <img src={lang.flag} alt={`${lang.name} flag`} className="flag" />
              <p>{lang.name}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
