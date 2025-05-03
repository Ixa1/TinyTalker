import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './DailyQuests.module.css';
//import './Sidebar.css'; // optional if Sidebar styles are shared

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-inline">
        <h2 className="tiny">Tiny</h2>
        <h2 className="talker">Talker</h2>
      </div>
      <nav>
        <ul>
          <li className={location.pathname === '/learn' ? 'active-sidebar' : ''}>
            <Link to="/learn" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span role="img" aria-label="Learn">🏠</span> Learn
            </Link>
          </li>
          <li className={location.pathname === '/leaderboard' ? 'active-sidebar' : ''}>
            <Link to="/leaderboard"><span role="img" aria-label="Leaderboard">🏆</span> Leaderboard</Link>
          </li>
          <li className={location.pathname === '/quests' ? 'active-sidebar' : ''}>
            <Link to="/quests"><span role="img" aria-label="Quests">🎯</span> Quests</Link>
          </li>
          <li className={location.pathname === '/profile' ? 'active-sidebar' : ''}>
            <Link to="/profile"><span role="img" aria-label="Profile">👤</span> Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const QuestsPage = () => {
  const quests = [
    { id: 1, icon: '⚡', title: 'Earn 20 XP', progress: 0, total: 20 },
    { id: 2, icon: '🤖', title: 'Get 5 in a row correct in 2 lessons', progress: 0, total: 2 },
    { id: 3, icon: '⏱️', title: 'Score 80% or higher in 5 lessons', progress: 0, total: 5 },
  ];

  return (
    <div className="app">
      <Sidebar />
      <div className={styles.questContainer}>
        <h2 className={styles.title}>Daily Quests</h2>

        <div className={styles.questList}>
          {quests.map((quest) => (
            <div key={quest.id} className={styles.questCard}>
              <div className={styles.questHeader}>
                <span className={styles.icon}>{quest.icon}</span>
                <span className={styles.questTitle}>{quest.title}</span>
              </div>
              <progress
                className={styles.progressBar}
                value={quest.progress}
                max={quest.total}
              />
              <div className={styles.questProgressText}>
                {quest.progress} / {quest.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestsPage;
