import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import avatar1 from '../Asset/avatars/avatar1.jpg';
import avatar2 from '../Asset/avatars/avatar2.jpg';
import avatar3 from '../Asset/avatars/avatar3.jpg';
import './ProfilePage.module.css' 

const ProfilePage = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(avatar1);
  const [showPicker, setShowPicker] = useState(false);
  const [sidebarOpen] = useState(true);
  const navigate = useNavigate();

  const user = {
    name: 'Ichha',
    username: '@Ichha',
    joined: '12th April 2025',
    stats: {
      streak: 302,
      xp: 54721,
      league: 'Emerald',
      topFinishes: 5,
    },
    progress: [
      { course: 'English', percent: 70 },
      { course: 'Nepali', percent: 45 },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
    setShowPicker(false);
  };

  return (
    <div className={`${styles.page} ${sidebarOpen ? '' : styles.collapsed}`}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.toggleWrapper}></div>

        <h2 className={styles.logo}>✨ Tiny Talker</h2>
        <nav className={styles.nav}>
          <button onClick={() => navigate('/dashboard')}>📘 Learn</button>
          <button onClick={() => navigate('/leaderboard')}>🏆 Leaderboard</button>
          <button onClick={() => navigate('/quests')}>🧩 Quests</button>
          <button className={styles.active}>👩‍🎓 Profile</button>
          <button onClick={() => navigate('/settings')}>⚙️ More</button>
        </nav>
        <div className={styles.controls}>
          <button className={styles.logout} onClick={handleLogout}>🔒 Logout</button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <img src={selectedAvatar} alt="Avatar" className={styles.avatar} />
            <button
              onClick={() => setShowPicker(!showPicker)}
              className={styles.avatarEditBtn}
            >
              ✏️
            </button>
            {showPicker && (
              <div className={styles.avatarPicker}>
                {[avatar1, avatar2, avatar3].map((a, i) => (
                  <img
                    key={i}
                    src={a}
                    alt={`Avatar ${i}`}
                    className={styles.avatarOption}
                    onClick={() => handleAvatarChange(a)}
                  />
                ))}
              </div>
            )}
          </div>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.username}>{user.username}</p>
          <p className={styles.joined}>🎉 Joined on {user.joined}</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🏅 Achievements</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span>🔥</span>
              <h3>{user.stats.streak}</h3>
              <p>Day Streak</p>
            </div>
            <div className={styles.statCard}>
              <span>⚡</span>
              <h3>{user.stats.xp}</h3>
              <p>Total XP</p>
            </div>
            <div className={styles.statCard}>
              <span>🥇</span>
              <h3>{user.stats.topFinishes}</h3>
              <p>Top Finishes</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 Course Progress</h2>
          <div className={styles.progressList}>
            {user.progress.map((p, i) => (
              <div key={i} className={styles.progressItem}>
                <span className={styles.courseTitle}>{p.course}</span>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${p.percent}%` }}>
                    {p.percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
