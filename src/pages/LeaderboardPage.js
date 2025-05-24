import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeaderboardPage.css';
import GlobalLayout from '../components/GlobalLayout';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/leaderboard/`);
        setLeaders(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <GlobalLayout>
      <div className="leaderboard-container">
        <h1 className="leaderboard-title">Leaderboard</h1>
        {error && <p className="error-text">{error}</p>}
        {!error && leaders.length === 0 && <p>Loading leaderboard...</p>}
        <div className="leaderboard-list">
          {leaders.map((u, i) => (
            <div key={u.userId} className="leaderboard-item">
              <span className="leaderboard-rank">#{i + 1}</span>
              <div className="leaderboard-avatar"></div>
              <span className="leaderboard-username">{u.username || `User ${u.userId}`}</span>
              <span className="leaderboard-xp">{(u.xp ?? 0).toLocaleString()} XP</span>

            </div>
          ))}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default LeaderboardPage;
